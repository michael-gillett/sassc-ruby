class Api::GoLinksController < ApplicationController

  def index #fetch all links
    response_body =
    [
      { ok: true,
        message: "",
        query:
        {
          alias: "qa",
          description: "LR Kiunei Page",
          url: "http://www.kiunei.com/app/#/events/ORGANIZATION/5639274879778816"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "expenses",
          description: "Acxiom/LiveRamp Expense Center",
          url: "https://wd5.myworkday.com/acxiom/d/home.htmld#selectedWorklet=501%2487"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "hackweek",
          description: "What is Hackweek?",
          url: "https://support.liveramp.com/display/CI/Hackweek"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "home",
          description: "LiveRamp Home Page",
          url: "https://liveramp.com"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "kb",
          description: "Knowledge Base Home Page",
          url: "https://support.liveramp.com/display/CI/LiveRamp+Internal+Resource+Center"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "conference_rooms",
          description: "I can never find my conference room.",
          url: "https://support.liveramp.com/pages/viewpage.action?pageId=1769611"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "armaan",
          description: "Where is Armaan? <3",
          url: "https://liveramp.com/whereIsArmaan"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "product",
          description: "LR Product Info",
          url: "https://support.liveramp.com/display/CI/Product+Info"
        }
      },      { ok: true,
        message: "",
        query:
        {
          alias: "lunch",
          description: "Chewse Calendar Download",
          url: "https://www.chewse.com/calendars/4f05f496-5b65-4d8f-8e03-21ad64d8cbd5"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "okta",
          description: "Acxiom's OKTA Page",
          url: "https://acxiom.okta.com"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "frosch",
          description: "Acxiom's FROSCH Booking Page",
          url: "https://client.frosch.com/FroschAdmin/FClientsSite.aspx"
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

  def create
    response =
    {
      ok: true,
      query:
      {
        alias: "engineering",
        description: "LiveRamp Engineering",
        url: "https://git.liveramp.net"
      }
    }
    if response.ok
      render json: { redirect_to: "/", go_link: response.query }, status: 200
    else
      render json: { message: "Failed to save go/ link.", error_message: response.message }, status: 500
    end
  end

  def update
    response =
    # {
    #   ok: false,
    #   message: "not found"
    # }
    {
      ok: true,
      query:
      {
        alias: "engineering",
        description: "LiveRamp Jenkins",
        url: "https://jenkins.liveramp.net"
      }
    }

    if response.ok
      render json: { redirect_to: "/", go_link: response.query }, status: 200
    else
      render json: { message: "Failed to update go/ link.", error_message: response.message }, status: 500
    end
  end

  def destroy
    response =
    {
      ok: true,
      query:
      {
        alias: "engineering",
        description: "LiveRamp Jenkins",
        url: "https://jenkins.liveramp.net"
      }
    }

    if response.ok
      render json: { go_link: response.query }, status: 200
    else
      render json: { go_link: response.query, message: response.message }, status: 500
    end
  end

end
