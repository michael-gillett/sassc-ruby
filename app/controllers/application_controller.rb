class ApplicationController < ActionController::Base
  include SamlHelper

  helper_method [:init_active_user]
  before_action :init_active_user, only: :index

  def index
    gon.push(
      env: Rails.env,
      active_user: session[:active_user]
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
