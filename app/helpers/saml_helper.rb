module SamlHelper
  
  def generate_okta_login_url
    settings = get_saml_settings(sso_customer)
    request = OneLogin::RubySaml::Authrequest.new
    redirect_url_with_saml_query = request.create(settings)
  end

  def get_saml_settings

    # should retrieve SAML-settings based on subdomain, IP-address, NameID or similar
    settings = OneLogin::RubySaml::Settings.new

    # When disabled, saml validation errors will raise an exception.
    settings.soft = true

    #SP section
    settings.issuer                         = request_url # Must match audience URI / Audience Restriction in Okta Settings for Valid Response
    settings.assertion_consumer_service_url = request_url # Must match destination in Okta Settings for Valid Response

    # IdP section
    settings.idp_entity_id                  = sso_customer.issuer #Must match identity provider issuer in Okta.
    settings.idp_sso_target_url             = sso_customer.sso_target_url
    settings.idp_cert                       = sso_customer.certificate

    settings.name_identifier_format         = "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"

    # Security section
    settings.security[:authn_requests_signed] = false
    settings.security[:logout_requests_signed] = false
    settings.security[:logout_responses_signed] = false
    settings.security[:metadata_signed] = false
    settings.security[:digest_method] = XMLSecurity::Document::SHA1
    settings.security[:signature_method] = XMLSecurity::Document::RSA_SHA1

    settings
  end

end
