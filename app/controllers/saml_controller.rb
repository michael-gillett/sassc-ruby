class SamlController < ApplicationController
  include SamlHelper

  def index
    render json: { redirect_url: generate_okta_login_url }, status: :ok
  end

  def create
    redirect_url = params[:relayState] == "create" ? root_url + "/create" : "root_url"
    settings = get_saml_settings
    response = OneLogin::RubySaml::Response.new(params.require(:SAMLResponse), :settings => settings)
    response.is_valid? ? session[:active_user] = response.nameid : flash[:errors] = "Something went wrong"
    redirect_to redirect_url
  end

end
