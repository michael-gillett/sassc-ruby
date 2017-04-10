class ApplicationController < ActionController::Base
  include SamlHelper

  helper_method [:init_active_user]

  def logout
    session[:active_user] = nil
    redirect_to root_url
  end

  def login
    redirect_to generate_okta_login_url
  end

  private

  def init_active_user
    if session[:active_user]
      @active_user = session[:active_user]
    else
      return render json: {redirect_url: generate_okta_login_url}, status: 200
    end
  end

end
