class SamlController < ApplicationController
  before_action :saml_enabled?

  def init
    respond_to do |format|
      format.html { redirect_to sso_saml_index_url request }
      format.json { render json: { url: init_saml_index_url } }
    end
  end

  def sso
    settings = saml_settings
    if settings.nil?
      render action: :no_settings
      return
    end

    request = OneLogin::RubySaml::Authrequest.new
    redirect_to(request.create(settings))
  end

  def acs
    response = OneLogin::RubySaml::Response.new(params[:SAMLResponse])
    response.settings = saml_settings

    if response.is_valid?
      user = Staff.find_by email: response_email(response)
      return saml_failure if user.nil?
      sign_in user
      redirect_to authenticated_url
    else
      saml_failure
    end
  end

  # Trigger SP and IdP initiated Logout requests
  def logout
    # If we're given a logout request, handle it in the IdP logout initiated method
    if params[:SAMLRequest]
      return idp_logout_request

      # We've been given a response back from the IdP
    elsif params[:SAMLResponse]
      return process_logout_response
    elsif params[:slo]
      return sp_logout_request
    else
      reset_session
    end
  end

  # Create an SP initiated SLO
  def sp_logout_request
    # LogoutRequest accepts plain browser requests w/o paramters
    settings = saml_settings

    if settings.idp_slo_target_url.nil?
      reset_session
    else

      # Since we created a new SAML request, save the transaction_id
      # to compare it with the response we get back
      logout_request = OneLogin::RubySaml::Logoutrequest.new
      session[:transaction_id] = logout_request.uuid

      if settings.name_identifier_value.nil?
        settings.name_identifier_value = session[:user_id]
      end

      relay_state =  url_for controller: 'saml', action: 'index'
      redirect_to(logout_request.create(settings, RelayState: relay_state))
    end
  end

  # After sending an SP initiated LogoutRequest to the IdP, we need to accept
  # the LogoutResponse, verify it, then actually delete our session.
  def process_logout_response
    settings = saml_settings

    if session.key? :transation_id
      logout_response = OneLogin::RubySaml::Logoutresponse.new(params[:SAMLResponse], settings, matches_request_id: session[:transation_id])
    else
      logout_response = OneLogin::RubySaml::Logoutresponse.new(params[:SAMLResponse], settings)
    end

    # Validate the SAML Logout Response
    # Actually log out this session
    reset_session if logout_response.success?
  end

  # Method to handle IdP initiated logouts
  def idp_logout_request
    settings = saml_settings
    logout_request = OneLogin::RubySaml::SloLogoutrequest.new(params[:SAMLRequest])
    render inline: logger.error unless logout_request.is_valid?

    # Actually log out this session
    reset_session

    logout_response = OneLogin::RubySaml::SloLogoutresponse.new.create(settings, logout_request_id, nil, RelayState: params[:RelayState])
    redirect_to logout_response
  end

  def saml_settings
    idp_metadata_parser = OneLogin::RubySaml::IdpMetadataParser.new
    # Returns OneLogin::RubySaml::Settings prepopulated with idp metadata
    settings = idp_metadata_parser.parse_remote(ENV['SAML_REMOTE_XML_URL'])

    settings.assertion_consumer_service_url = acs_saml_index_url
    settings.assertion_consumer_logout_service_url = logout_saml_index_url
    settings.issuer = "#{metadata_saml_index_url}.xml"

    settings.name_identifier_format = ENV['SAML_IDENTIFIER']
    settings.authn_context = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'

    settings.certificate = ENV['SAML_CERTIFICATE']

    settings
  end

  def metadata
    settings = saml_settings
    meta = OneLogin::RubySaml::Metadata.new
    render xml: meta.generate(settings), content_type: 'application/samlmetadata+xml'
  end

  private

  def saml_enabled?
    # This is the only way I could get the rspec tests to pass with Capybara
    respond_to do |format|
      format.html { return saml_failure if ENV['SAML_ENABLED'].nil? }
      format.json { render json: { error: 'Not found.' } if ENV['SAML_ENABLED'].nil? }
    end
    true
  end

  def saml_failure
    head 404, content_type: :plain
    false
  end

  def response_email(response)
    [
      response.name_id,
      response.attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      response.attributes['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn']
    ].find { |v| v[/^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Z‌​a-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/i] }
  end

  # User Redirection urls

  def authenticated_url
    ENV['SAML_REDIRECT_URL']
  end
end
