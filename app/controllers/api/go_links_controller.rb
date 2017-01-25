class Api::GoLinksController < ApplicationController

  def index #fetch all links
    response_body =
    [
      { ok: true,
        message: "",
        query:
        {
          alias: "jocelyn",
          description: "pm",
          url: "https://liveramp.com"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "baptiste",
          description: "eng",
          url: "https://facebook.com"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "sherif",
          description: "eng",
          url: "https://flowers.com"
        }
      }
    ]

    render json: response_body
  end

  def show #fetch regex, param[:alias]
    { ok: true,
      message: "",
      query:
      {
        alias: "jocelyn",
        description: "pm",
        url: "https://liveramp.com"
      }
    }
    # { ok: false }
  end

  def create # POST, add new link
  end

  def update # PATCH, update need to provide an id

  end

  def destroy # DELETE,
  end

end
