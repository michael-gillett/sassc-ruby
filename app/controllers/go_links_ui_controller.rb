class GoLinksUiController < ApplicationController

  def show
    go_alias = params[:path]
    if go_alias
      go_link = get_alias_info(go_alias)
      return redirect_to go_link[:query][:url] if !go_link[:query].nil? && go_link[:status]
    end
    return redirect_to root_url
  end

  private

  def get_alias_info(alias_name)
    response = HTTParty.get(API_PATH + '/exact/' + alias_name)
    go_link_info = response["entities"].first
    go_link_response = {
      status: response["ok"],
      message: response["message"],
      query: go_link_info.nil? ? nil : go_link_info.symbolize_keys
    }
    go_link_response
  end

end
