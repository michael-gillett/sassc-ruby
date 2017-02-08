class GoLinksUiController < ApplicationController

  def get_alias_info(alias_name)
    alias_bank =
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
          url: "http://wd5.myworkday.com/acxiom/d/home.htmld#selectedWorklet=501%2487"
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
          url: "http://liveramp.com"
        }
      },
      { ok: true,
        message: "",
        query:
        {
          alias: "kb",
          description: "Knowledge Base Home Page",
          url: "http://support.liveramp.com/display/CI/LiveRamp+Internal+Resource+Center"
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

    return alias_bank.select{ |alias_info| alias_info[:query][:alias] == alias_name }.first
  end

  def index
    gon.push(
      env: Rails.env
    )

    go_alias = params[:path]
    if go_alias
      go_link = get_alias_info(go_alias)
      if !go_link.nil? && go_link.ok
        redirect_to go_link.query.url
      end
    else
      render :index
    end
  end

end
