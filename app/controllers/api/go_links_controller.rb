class Api::GoLinksController < ApplicationController
  include GoLinksHelper

  # JL: Write go_links_api gem, fix error messages
  # 2/24/2017
  before_action :init_active_user, only: [:create, :update, :destroy]

  def index
    response = HTTParty.get('http://connect-staging-t04.liveramp.net/go_links_api')
    alias_bank = response["entities"]
    marked_alias_bank = flag_links_owned_by_active_user(alias_bank)
    render json: marked_alias_bank
  end

  def create
    new_link = format_link_params(params)
    response = HTTParty.post('http://connect-staging-t04.liveramp.net/go_links_api',
      body: new_link.to_json,
      headers: { 'Content-Type' => 'application/json' }
    )

    if response["ok"]
      render json: { redirect_to: "/", go_link: response["entities"].first }, status: 200
    else
      render json: { message: "Failed to save go/ link.", error_message: response["message"] }, status: 500
    end
  end

  def update
    link = format_link_params(params)
    response = HTTParty.put('http://connect-staging-t04.liveramp.net/go_links_api/link',
      body: link.to_json,
      headers: { 'Content-Type' => 'application/json' }
    )

    if response["ok"]
      render json: { redirect_to: "/", go_link: response["entities"].first }, status: 200
    else
      render json: { message: "Failed to save go/ link.", error_message: response["message"] }, status: 500
    end
  end

  def destroy
    link = format_link_params(params)
    response = HTTParty.delete('http://connect-staging-t04.liveramp.net/go_links_api/link',
      body: link.to_json,
      headers: { 'Content-Type' => 'application/json' }
    )

    if response["ok"]
      render json: { redirect_to: "/", go_link: response["entities"].first }, status: 200
    else
      render json: { message: "Failed to save go/ link.", error_message: response["message"] }, status: 500
    end
  end

end
