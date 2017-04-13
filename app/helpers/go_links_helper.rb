module GoLinksHelper

  def format_link_params(params)
    alias_name = params.require(:alias)
    url = params.require(:url)
    description = params[:description]
    new_link = {
      alias: alias_name,
      url: url,
      description: description,
      owner: @active_user
    }

    new_link
  end

  def flag_links_owned_by_active_user(alias_bank)
    # this is clearly not performant
    alias_bank.each{ |link| link["owned_by_user"] = true if link["owner"] == session[:active_user] }
    alias_bank
  end

end
