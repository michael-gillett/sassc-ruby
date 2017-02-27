class GoLinksUiController < ApplicationController

  def get_alias_info(alias_name)
    response = HTTParty.get('http://wps.acxiom.com/go-api/all')
    alias_bank = response["entities"]
    go_link_info = alias_bank.select{ |alias_info| alias_info["alias"] == alias_name }.first
    go_link_response = {
      status: response["ok"],
      message: response["message"],
      query: go_link_info ? go_link_info.symbolize_keys : nil
    }
    go_link_response
  end

  def index
    gon.push(
      env: Rails.env
    )

    go_alias = params[:path]
    if go_alias
      go_link = get_alias_info(go_alias)
      if !go_link.nil? && go_link[:ok]
        redirect_to go_link[:query][:url]
      end
    else
      render :index
    end
  end

end
