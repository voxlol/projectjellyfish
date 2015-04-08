class SamlController < ApplicationController
  before_action :saml_enabled?

  def init
    respond_to do |format|
      format.html { redirect_to idp_login_request_url request }
      format.json { render json: { url: saml_init_url } }
    end
  end

  def consume
    response = idp_response params
    response.settings = saml_settings request
    if response.is_valid?
      user = Staff.find_by email: response_email(response)
      return saml_failure if user.nil?
      sign_in user
      redirect_to authenticated_url
    else
      saml_failure
    end
  end

  def metadata
    settings = saml_settings request
    meta = OneLogin::RubySaml::Metadata.new
    render xml: meta.generate(settings)
  end

  private

  def saml_enabled?
    @settings ||= Setting.find_by!(hid: 'saml').settings_hash
    return saml_failure unless @settings[:enabled]
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

  def idp_response(params)
    OneLogin::RubySaml::Response.new(params[:SAMLResponse])
  end

  def saml_settings(request)
    settings = OneLogin::RubySaml::Settings.new

    settings.assertion_consumer_service_url = @settings[:saml_consume_url] || saml_consume_url(host: request.host)
    settings.issuer = @settings[:issuer] || saml_metadata_url(host: request.host)
    settings.idp_entity_id = @settings[:entity_id]
    settings.idp_sso_target_url = @settings[:sso_target_url]
    settings.idp_slo_target_url = @settings[:slo_target_url]
    settings.idp_cert = @settings[:certificate]
    settings.idp_cert_fingerprint = @settings[:fingerprint]
    settings.name_identifier_format = @settings[:identifier]

    settings
  end

  def idp_login_request_url(request)
    idp_request = OneLogin::RubySaml::Authrequest.new
    idp_request.create saml_settings request
  end

  # User Redirection urls

  def authenticated_url
    @settings[:redirect_url]
  end
end
