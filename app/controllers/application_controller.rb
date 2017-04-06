class ApplicationController < ActionController::Base
  include SamlHelper

  helper_method [:init_active_user]

  private

  def init_active_user
    if session[:user_email]
      @active_user = session[:user_email]
    else
      return render json: {redirect_url: generate_okta_login_url}, status: 200
    end
  end

end
