module SamlHelper

  def generate_okta_login_url
    settings = get_saml_settings
    request = OneLogin::RubySaml::Authrequest.new
    request.create(settings)
  end

  def get_saml_settings

    # should retrieve SAML-settings based on subdomain, IP-address, NameID or similar
    settings = OneLogin::RubySaml::Settings.new

    # When disabled, saml validation errors will raise an exception.
    settings.soft = false

    #SP section
    settings.issuer                         = "https://go-links-staging-t01.liveramp.net/saml" # Must match audience URI / Audience Restriction in Okta Settings for Valid Response
    settings.assertion_consumer_service_url = "https://go-links-staging-t01.liveramp.net/saml" # Must match destination in Okta Settings for Valid Response

    # IdP section
    settings.idp_entity_id                  = "http://www.okta.com/exk1s7frengFf4FOb2p7" #Must match identity provider issuer in Okta.
    settings.idp_sso_target_url             = "https://liveramp.okta.com/app/liveramp_golinkshidden_1/exk1s7frengFf4FOb2p7/sso/saml"
    settings.idp_cert                       = Rails.application.secrets.idp_cert

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
