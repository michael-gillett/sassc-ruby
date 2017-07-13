class GoLinksUiController < ApplicationController

  def show
    path_params = params[:path].split("/")
    print path_params
    go_alias = path_params.first
    go_params = path_params.slice(1..-1)
    if go_alias
      go_alias = go_alias.gsub("_","-")
      go_link = get_alias_info(go_alias)
      if !go_link[:query].nil? && go_link[:status]
        link_url = add_go_link_params(go_link[:query][:url], go_params)
        return redirect_to link_url
      end
    end
    return redirect_to root_url
  end

  private

  def get_alias_info(alias_name)
    response = HTTParty.get(API_PATH + '/exact/' + alias_name)
    go_link_info = response["entities"].try(:first)
    go_link_response = {
      status: response["ok"],
      message: response["message"],
      query: go_link_info.nil? ? nil : go_link_info.symbolize_keys
    }
    go_link_response
  end

  def add_go_link_params(link_url, go_params)
    go_params.each do |p|
      link_url.sub!("<param>", p)
    end
    link_url
  end

end
