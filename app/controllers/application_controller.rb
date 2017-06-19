class ApplicationController < ActionController::Base
  include SamlHelper

  helper_method [:init_active_user]
  before_action :init_active_user, only: :index

  API_CHANGE_PATH = "http://wps.acxiom.com/go-api/admin"
  API_PATH = 'http://wps.acxiom.com/go-api'

  ADMIN_USERS = [
    "Jeanne.Lee@acxiom.com",
    "Tevy.Jacobs-Gomes@acxiom.com",
    "Jocelyn.Neff@acxiom.com",
    "Shrif.Nada@acxiom.com",
    "James.True@acxiom.com",
    "go-links-dev@liveramp.com" # for development
  ]

  logger_filter :go_links

  def index
    gon.push(
      env: Rails.env,
      active_user: @active_user_email,
      is_admin_user: ADMIN_USERS.include?(@active_user_email)
    )
  end

  def logout
    session[:active_user] = nil
  end

  private

  def init_active_user
    session[:active_user] = "go-links-dev@liveramp.com" #if Rails.env.development?

    if session[:active_user]
      @active_user_email = session[:active_user]
      # need this for rails logger to log user email to kibana
      @active_user = { primary_email: session[:active_user] }
      @active_user.define_singleton_method(:primary_email){ self[:primary_email] }
    else
      redirect_url = generate_okta_login_url
      redirect_url += "&RelayState=create" if request.path == "/create"
      return redirect_to redirect_url
    end
  end

end
