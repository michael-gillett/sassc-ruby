class GoLinksUiController < ApplicationController

  def index
    gon.push(
      env: Rails.env
    )
  end
end
