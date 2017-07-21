class GoLinksUiController < ApplicationController
  PARAM_FLAG = "<param>"

  def show
    # Split the parameters from the URL
    path_params = params[:path].split("/")
    print path_params
    go_alias = path_params.first
    go_params = path_params.slice(1..-1)

    if go_alias
      go_alias = go_alias.gsub("_","-")
      go_link = get_alias_info(go_alias)
      if !go_link[:query].nil? && go_link[:status]
        # Gets URL and adds parameters if given
       return add_go_link_params(go_link[:query][:url], go_params, go_alias)
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

  def add_go_link_params(link_url, go_params, go_alias)
    # Check that the proper number of params was given
    url_param_count = link_url.scan(/#{PARAM_FLAG}/).count
    if url_param_count != go_params.count
      return param_error(link_url, go_params, go_alias, url_param_count)
    end

    go_params.each do |p|
      link_url.sub!(PARAM_FLAG, p)
    end
    return redirect_to link_url
  end

  def param_error(link_url, go_params, go_alias, url_param_count)
    @link_url = link_url
    @go_params_count = go_params.count
    @go_alias = go_alias
    @url_param_count = url_param_count
    render "paramerror", :status => 400
  end

end
