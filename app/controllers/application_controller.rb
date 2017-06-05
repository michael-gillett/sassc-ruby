class ApplicationController < ActionController::Base
  include SamlHelper

  helper_method [:init_active_user]
  before_action :init_active_user, only: :index

  API_CHANGE_PATH = "http://wps.acxiom.com/go-api/admin"
  API_PATH = 'http://wps.acxiom.com/go-api'

  ADMIN_USERS = [
    "jeanne.lee@acxiom.com",
    "tevy.jacobs-gomes@acxiom.com",
    "jocelyn.neff@acxiom.com",
    "shrif.nada@acxiom.com",
    "james.true@acxiom.com"
  ]

  def index
    gon.push(
      env: Rails.env,
      active_user: @active_user,
      is_admin_user: ADMIN_USERS.include?(@active_user)
    )
  end

  def logout
    session[:active_user] = nil
  end

  private

  def init_active_user
    session[:active_user] = "go-links-dev@liveramp.com" if Rails.env.development?

    if session[:active_user]
      @active_user = session[:active_user]
    else
      return redirect_to generate_okta_login_url
    end
  end

end
