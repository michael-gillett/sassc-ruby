class SamlController < ApplicationController
  include SamlHelper

  def create
    settings = get_saml_settings
    response = OneLogin::RubySaml::Response.new(saml_response, :settings => settings)
    response.is_valid? ? session[:user_email] = response.nameid : flash[:errors] = "Something went wrong"
    redirect_to root_url
  end
end
