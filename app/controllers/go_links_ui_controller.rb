class GoLinksUiController < ApplicationController
  PARAM_FLAG = "<param>"

  def show
    # Split the parameters from the URL
    path_params = params[:path].split("/")
    go_alias = path_params.first
    go_params = path_params.slice(1..-1)
    return redirect_to root_url unless go_alias
    go_link = Link.find_by_alias go_alias
    return redirect_to root_url unless go_link

    # Gets URL and adds parameters if given
    add_go_link_params(go_link.url, go_params, go_alias)
  end

  private

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
