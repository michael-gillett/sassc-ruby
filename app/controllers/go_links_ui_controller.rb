class GoLinksUiController < ApplicationController

  def index
    go_alias = params[:path]
    if go_alias
      go_link = get_alias_info(go_alias)
      return redirect_to go_link[:query][:url] if !go_link[:query].nil? && go_link[:status]
    end
    return redirect_to root_url
  end

  private

  def get_alias_info(alias_name)
    response = HTTParty.get("http://connect-staging-t04.liveramp.net/go_links_api/#{alias_name}")
    go_link_info = response["entities"].first
    go_link_response = {
      status: response["ok"],
      message: response["message"],
      query: go_link_info.nil? ? nil : go_link_info.symbolize_keys
    }
    go_link_response
  end

end
