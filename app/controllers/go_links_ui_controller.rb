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

    go_alias = params[:path]

    if go_alias
      go_link = get_alias_info(go_alias)
      if !go_link.nil? && go_link[:status]
        return redirect_to go_link[:query][:url]
      end
    end

    return redirect_to root_url
  end


end
