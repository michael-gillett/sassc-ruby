module SamlHelper

  def generate_okta_login_url
    settings = get_saml_settings
    request = OneLogin::RubySaml::Authrequest.new
    redirect_url_with_saml_query = request.create(settings)
  end

  def get_saml_settings

    # should retrieve SAML-settings based on subdomain, IP-address, NameID or similar
    settings = OneLogin::RubySaml::Settings.new

    # When disabled, saml validation errors will raise an exception.
    settings.soft = true

    #SP section
    settings.issuer                         = "http://localhost:3000/saml" # Must match audience URI / Audience Restriction in Okta Settings for Valid Response
    settings.assertion_consumer_service_url = "http://localhost:3000/saml" # Must match destination in Okta Settings for Valid Response

    # IdP section
    settings.idp_entity_id                  = "http://www.okta.com/exka4nz9xevBvKWga0h7" #Must match identity provider issuer in Okta.
    settings.idp_sso_target_url             = "https://dev-141682.oktapreview.com/app/acxiomdev141682_golinks_1/exka4nz9xevBvKWga0h7/sso/saml"
    settings.idp_cert                       = "-----BEGIN CERTIFICATE-----
MIIDpDCCAoygAwIBAgIGAVmUrXSAMA0GCSqGSIb3DQEBBQUAMIGSMQswCQYDVQQGEwJVUzETMBEG
A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU
MBIGA1UECwwLU1NPUHJvdmlkZXIxEzARBgNVBAMMCmRldi0xNDE2ODIxHDAaBgkqhkiG9w0BCQEW
DWluZm9Ab2t0YS5jb20wHhcNMTcwMTEyMjE1NDEyWhcNMjcwMTEyMjE1NTEyWjCBkjELMAkGA1UE
BhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNV
BAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRMwEQYDVQQDDApkZXYtMTQxNjgyMRwwGgYJ
KoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
kuUA6RhLt10c+AiIZGuohG1PMY60u8NEEclj5hzR5RIkcyKlkUy2hYQ5WdPoBdC4hWcpBkNoESk7
mlGjb+Z/8ReJkmImKVXXZyOBZ1/ZddOm7bPJ0KnbSJu1s5I2XAiPXrm88565MjIvzfZOjdkpAg78
UrJsWzcfOa+jPB7kmS7SpiPhuwaP+MW1to5qppfitEC2hvdAIGzubQpy3kPsXWuchofZCmXY5PNm
K5Py8L2/ad7Xxw511xb6+9kKxmvIqPPToIEeMLN0MoQtrsXqMEtQsub9IiIq+5+IVhemlbVa5PHj
zEaDWDq6yIbmwbq/61Ki3OYSWZANbNu1Cyo6DQIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQBw15rv
embcP/0mmtRWA38vZZ7p3ymGH/7p2XwBPet/XGneK9HO/jUq/taT2nbrKtZyQXa7DFifDd+Q63yW
6/3Mc+jM4sB7U01JsJpvhMUdUa+u+lOwyX/dFY4KYtzkXKidRHv1SVv5zlX9/thQDRAS66kzgXbo
ceUg6cmhwdmygQyEdUiJkXv88AI+iAqmf3L2dI0oNDToPiAz6LJN9KPJ5wB23vsKpJqUFuvSR3Zq
MN4K5oBJXI3yMEgJNeBk6kcls8VXFKrQ5RCEP3Rqke5toUWi/nTUD3yZ8jH/2T5xA5w2KMu95x/b
clrYBlXwvd342DWmIEgiqwIFNJZAKMuA
-----END CERTIFICATE-----"

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
