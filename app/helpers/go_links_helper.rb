module GoLinksHelper

  def format_link_params(params)
    alias_name = params.require(:alias)
    url = params.require(:url)
    description = params[:description]
    new_link = {
      alias: alias_name,
      url: url,
      description: description
    }

    new_link.to_json
  end
end
