class GoLinksUiController < ApplicationController

  def get_alias_info(alias_name)
    # { ok: true,
    #   message: "",
    #   query:
    #   {
    #     alias: "jocelyn",
    #     description: "pm",
    #     url: "https://liveramp.com"
    #   }
    # }
    { ok: false }
  end

  def index
    gon.push(
      env: Rails.env
    )

    go_alias = params[:path]
    if go_alias
      go_link = get_alias_info(go_alias)
      if go_link.ok
        redirect_to go_link.query.url
      end
    else
      render :index
    end
  end

end
