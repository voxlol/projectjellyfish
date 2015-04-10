class SamlController < ApplicationController
  before_action :saml_enabled?

  def init
    respond_to do |format|
      format.html { redirect_to sso_saml_index_url request }
      format.json { render json: { url: saml_init_url } }
    end
  end

  def sso
    settings = get_saml_settings
    if settings.nil?
      render :action => :no_settings
      return
    end

    request = OneLogin::RubySaml::Authrequest.new
    redirect_to(request.create(settings))

  end

  def acs
    response = OneLogin::RubySaml::Response.new(params[:SAMLResponse])
    response.settings = get_saml_settings

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
    settings = get_saml_settings

    if settings.idp_slo_target_url.nil?
      logger.info 'SLO IdP Endpoint not found in settings, executing then a normal logout'
      reset_session
    else

      # Since we created a new SAML request, save the transaction_id
      # to compare it with the response we get back
      logout_request = OneLogin::RubySaml::Logoutrequest.new()
      session[:transaction_id] = logout_request.uuid
      logger.info "New SP SLO for User ID: '#{session[:user_id]}', Transaction ID: '#{session[:transaction_id]}'"

      if settings.name_identifier_value.nil?
        settings.name_identifier_value = session[:user_id]
      end

      relayState =  url_for controller: 'saml', action: 'index'
      redirect_to(logout_request.create(settings, :RelayState => relayState))
    end
  end

  # After sending an SP initiated LogoutRequest to the IdP, we need to accept
  # the LogoutResponse, verify it, then actually delete our session.
  def process_logout_response
    settings = get_saml_settings

    if session.has_key? :transation_id
      logout_response = OneLogin::RubySaml::Logoutresponse.new(params[:SAMLResponse], settings, :matches_request_id => session[:transation_id])
    else
      logout_response = OneLogin::RubySaml::Logoutresponse.new(params[:SAMLResponse], settings)
    end

    logger.info "LogoutResponse is: #{logout_response.to_s}"

    # Validate the SAML Logout Response
    if not logout_response.validate
      logger.error 'The SAML Logout Response is invalid'
    else
      # Actually log out this session
      if logout_response.success?
        logger.info "Delete session for '#{session[:user_id]}'"
        reset_session
      end
    end
  end

  # Method to handle IdP initiated logouts
  def idp_logout_request
    settings = get_saml_settings
    logout_request = OneLogin::RubySaml::SloLogoutrequest.new(params[:SAMLRequest])
    if !logout_request.is_valid?
      logger.error 'IdP initiated LogoutRequest was not valid!'
      render :inline => logger.error
    end
    logger.info "IdP initiated Logout for #{logout_request.name_id}"

    # Actually log out this session
    reset_session

    logout_response = OneLogin::RubySaml::SloLogoutresponse.new.create(settings, logout_request_id, nil, :RelayState => params[:RelayState])
    redirect_to logout_response
  end

  def get_saml_settings
    idp_metadata_parser = OneLogin::RubySaml::IdpMetadataParser.new
    # Returns OneLogin::RubySaml::Settings prepopulated with idp metadata
    settings = idp_metadata_parser.parse_remote('http://sso.projectjellyfish.org:8080/openam/saml2/jsp/exportmetadata.jsp?entityid=https://sso.projectjellyfish.org:8443/openam')

    settings.assertion_consumer_service_url = acs_saml_index_url
    settings.assertion_consumer_logout_service_url = logout_saml_index_url
    settings.issuer = "#{metadata_saml_index_url}.xml"

    settings.name_identifier_format = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
    settings.authn_context = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'

    settings.certificate = '-----BEGIN CERTIFICATE-----
MIIDbzCCAtigAwIBAgIJALLyD62/xQ5WMA0GCSqGSIb3DQEBBQUAMIGCMQswCQYD
VQQGEwJVUzEOMAwGA1UECBMFVGV4YXMxITAfBgNVBAoTGEludGVybmV0IFdpZGdp
dHMgUHR5IEx0ZDEYMBYGA1UEAxMPSmVyaW1pYWggTWlsdG9uMSYwJAYJKoZIhvcN
AQkBFhdtaWx0b25famVyaW1pYWhAYmFoLmNvbTAeFw0xNTA0MDkyMDI3MzlaFw0x
ODA0MDgyMDI3MzlaMIGCMQswCQYDVQQGEwJVUzEOMAwGA1UECBMFVGV4YXMxITAf
BgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDEYMBYGA1UEAxMPSmVyaW1p
YWggTWlsdG9uMSYwJAYJKoZIhvcNAQkBFhdtaWx0b25famVyaW1pYWhAYmFoLmNv
bTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAlG570+tDpHHkVJASVhaUIYwN
wN4zePFDBUkwmtGSho5NF8glIunZDNjnJ1mG5TG15Eg3UvJUk6+xsN9VXCdBS4Y8
LpUhT2bhbiZWWvDKcbDOPOq8pDTlhBC2YBEvFtuPkCx2tA7H8m0o+JRH+GokaDSY
I8WhH9mii1PpgEvBzKkCAwEAAaOB6jCB5zAdBgNVHQ4EFgQUHa3b8vUm18bOsMuE
Xf9JLxyiVJgwgbcGA1UdIwSBrzCBrIAUHa3b8vUm18bOsMuEXf9JLxyiVJihgYik
gYUwgYIxCzAJBgNVBAYTAlVTMQ4wDAYDVQQIEwVUZXhhczEhMB8GA1UEChMYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMRgwFgYDVQQDEw9KZXJpbWlhaCBNaWx0b24x
JjAkBgkqhkiG9w0BCQEWF21pbHRvbl9qZXJpbWlhaEBiYWguY29tggkAsvIPrb/F
DlYwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQUFAAOBgQAKu7O244ykwkD3GoMJ
rX9D+Wnb40yKaf+nw2HOzFJoBUfw8ZAg8bCpylKfgtDeNHF8maS2GYNgV6DSVpvN
ZO010V1TQElu+KjiA7tmO/+Q7f+rK4cs9rxdadlxViqKQRNMCfkHE9/zLR55BhF1
EsfmBbBdnRLMj4mjPc9gk+wh8w==
-----END CERTIFICATE-----'

    settings
  end

  def metadata
    settings = get_saml_settings
    meta = OneLogin::RubySaml::Metadata.new
    render xml: meta.generate(settings), content_type: 'application/samlmetadata+xml'
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

  def saml_settings(request)
    idp_metadata_parser = OneLogin::RubySaml::IdpMetadataParser.new

    settings = idp_metadata_parser.parse_remote('http://bahsso.bah-sisp.com:8080/openam/saml2/jsp/exportmetadata.jsp?entityid=https://bahsso.bah-sisp.com:8443/openam')
    #settings = OneLogin::RubySaml::Settings.new

    settings.assertion_consumer_service_url = saml_consume_url host: request.host
    settings.issuer = 'https://sso.projectjellyfish.org:8443/openam'
    settings.name_identifier_format = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
    settings.authn_context = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'
    # settings.assertion_consumer_service_url = @settings[:saml_consume_url] || saml_consume_url(host: request.host)
    # settings.issuer = @settings[:issuer] || saml_metadata_url(host: request.host)
    # settings.name_identifier_format = @settings[:identifier]
    #
    # # Optional for most SAML IdPs
    # settings.authn_context = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'

    # settings = OneLogin::RubySaml::Settings.new
    # settings.security[:authn_requests_signed] = true
    # settings.security[:embed_sign] = true
    # settings.security[:digest_method] = XMLSecurity::Document::SHA256
    #settings.security[:signature_method] = XMLSecurity::Document::RSA_SHA256

    # ap @settings

    # settings.assertion_consumer_service_url = @settings[:saml_consume_url] || saml_consume_url(host: request.host)
    # settings.assertion_consumer_logout_service_binding = @settings[:saml_consume_]
    # settings.issuer = @settings[:issuer] || saml_metadata_url(host: request.host)
    # settings.idp_entity_id = @settings[:entity_id]
    # settings.idp_sso_target_url = @settings[:sso_target_url]
    # settings.idp_slo_target_url = @settings[:slo_target_url]
    # settings.certificate = @settings[:certificate]
    # settings.idp_cert_fingerprint = @settings[:fingerprint]
    # settings.name_identifier_format = @settings[:identifier]

    # settings.assertion_consumer_service_url = 'http://sso.projectjellyfish.org:8080/openam/AIDReqUri/IDPRole/metaAlias/idp'

    ap settings

    settings
  end

  # User Redirection urls

  def authenticated_url
    @settings[:redirect_url]
  end
end
