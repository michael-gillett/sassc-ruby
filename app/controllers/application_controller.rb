class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  logger_filter :go_server
end
