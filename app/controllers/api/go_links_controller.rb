class Api::GoLinksController < ApplicationController

  before_action :init_active_user, only: [:create, :update, :destroy]

  def index
    render json: Link.all
  end

  def create
    formatted_params = format_link_params(params)
    link = Link.create! formatted_params
    render json: { redirect_to: "/", go_link: link }, status: 200
  rescue => e
    render json: {
      message: "Failed to create go/ link.",
      error_message: e.message
    }, status: 500
  end

  def update
    formatted_params = format_link_params(params)
    link = Link.find(params.require(:id))
    if link.owner == @active_user || ADMIN_USERS.include?(@active_user)
      link.update! formatted_params
      render json: { redirect_to: "/", go_link: link }, status: 200
    else
      render json: {
        message: "Unable to update go/ link you do not own."
      }, status: :forbidden
    end
  rescue => e
    render json: {
      message: "Failed to save go/ link.",
      error_message: e.message
    }, status: 500
  end

  def destroy
    link = Link.find(params.require(:id))
    if link.owner == @active_user || ADMIN_USERS.include?(@active_user)
      link.destroy!
      render json: { redirect_to: "/" }, status: 200
    else
      render json: {
        message: "Unable to delete go/ link you do not own."
      }, status: :forbidden
    end
  rescue => e
    render json: {
      message: "Failed to delete go/ link.",
      error_message: e.message
    }, status: 500
  end

  private

  def format_link_params(params)
    alias_name = params.require(:alias).gsub("_", "-")
    url = params.require(:url)
    owner = params.require(:owner)
    description = params[:description]

    go_links_owner = ADMIN_USERS.include?(@active_user) ? owner : @active_user

    new_link = {
      alias: alias_name,
      url: url,
      description: description,
      owner: go_links_owner
    }

    new_link
  end

end
