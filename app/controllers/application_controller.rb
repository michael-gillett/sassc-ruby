class ApplicationController < ActionController::Base
  include SamlHelper

  helper_method [:init_active_user]
  before_action :init_active_user, only: :index

  ADMIN_USERS = [
    "tjacobs@liveramp.com",
    "lerickson@liveramp.com", # yussss
    "go-links-dev@liveramp.com" # for development
  ]

  define_method(:append_info_to_payload) do |payload|
    super(payload)
    payload[:user_email] = @active_user
    payload[:remote_ip] = request.remote_ip
  end

  def index
    if params[:error]
      whatever
    end
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
    #NB this is only to test go links on docker because Okta will always redirect to golinks.liveramp.net
    session[:active_user] = "go-links-dev@liveramp.com" #if Rails.env.development?

    if session[:active_user]
      @active_user = session[:active_user].dup
    else
      redirect_url = generate_okta_login_url
      redirect_url += "&RelayState=create" if request.path == "/create"
      return redirect_to redirect_url
    end
  end

end
