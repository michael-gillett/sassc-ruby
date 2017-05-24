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
    settings.issuer                         = "https://golinks.liveramp.net/saml" # Must match audience URI / Audience Restriction in Okta Settings for Valid Response
    settings.assertion_consumer_service_url = "https://golinks.liveramp.net/saml" # Must match destination in Okta Settings for Valid Response

    # IdP section
    settings.idp_entity_id                  = "http://www.okta.com/exk1czka6e8XSJDzk0h8" #Must match identity provider issuer in Okta.
    settings.idp_sso_target_url             = "https://acxiom.okta.com/app/acxiom_golinks_1/exk1czka6e8XSJDzk0h8/sso/saml"
    settings.idp_cert                       = "-----BEGIN CERTIFICATE-----
MIIDnDCCAoSgAwIBAgIGAUtCLLrvMA0GCSqGSIb3DQEBBQUAMIGOMQswCQYDVQQGEwJVUzETMBEG
A1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEU
MBIGA1UECwwLU1NPUHJvdmlkZXIxDzANBgNVBAMMBmFjeGlvbTEcMBoGCSqGSIb3DQEJARYNaW5m
b0Bva3RhLmNvbTAeFw0xNTAxMzEyMjQ1NDJaFw00NTAxMzEyMjQ2NDJaMIGOMQswCQYDVQQGEwJV
UzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwE
T2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxDzANBgNVBAMMBmFjeGlvbTEcMBoGCSqGSIb3DQEJ
ARYNaW5mb0Bva3RhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALOXe5OBC4rE
1Ymof0CZ8hsD9MQYS2r/HggAZubtdPyA7ulezRwjlQIaNaorlZQNDDXYHX8y82Q2sKzv8AfXEly4
1OIGmLDL9I88QWXApJ6UPsw3w2auUr8l6ue7a5k6VLbr4dUJy942KYeHcq/R75afaxIWNWmoo7UA
zSmbpIeHVndxfMNLi6gXcy1oKctubgo1/8nvFZ+OUcXneMdmuZjMqUNySUpGXi8SFeqKkLJAc2Wr
QPpb/mRbi2UBaM1QSBHWiGnYpbFPiCaf3Ye0md3IQQpDrgBsv0D5XvgSaTQ0ONDSJpQI4r2Pkfy8
yiP8D9K7pXqXlSdPfDMOj7gnigsCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAhezmqCrjNGfYiyJM
ldPUTHqTCrm9+tlHF0tLqedays3qS7nTlYNfpC9WSnh2buxscfSrXcJgs1MR3HnqqLJ4YwWbC0E5
eNaAtn15qs/ELkfiaPLCSLEnnW6m++g3UTj/m9XqHxSBzvNfZThGS4srx+sM+NNGxfGcio/SrGmH
zf1Wf+KcBBv2W6VhzzCnLotHDTqaTaSApu9F9AmzDyfYnsjiydc8iO+sjnsckyP6sKE4W1/L2PcV
+Zdwoz0GJiH8Dl/3+p/4JHz0F+R3y8XhwgQ57nAHwz3Uqo2+ipZhd3mwmdNZo8BmwT9Dk3Qjuswq
M4zPZ0aI6h0IcmNW0IGyaw==
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
