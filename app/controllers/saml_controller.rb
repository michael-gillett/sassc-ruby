class SamlController < ApplicationController
  include SamlHelper

  def index
    render json: { redirect_url: generate_okta_login_url }, status: :ok
  end

  def create
    settings = get_saml_settings
    response = OneLogin::RubySaml::Response.new(params.require(:SAMLResponse), :settings => settings)
    response.is_valid? ? session[:active_user] = response.nameid : flash[:errors] = "Something went wrong"
    redirect_to root_url
  end

end