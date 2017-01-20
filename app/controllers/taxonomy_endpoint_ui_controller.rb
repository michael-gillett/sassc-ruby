class TaxonomyEndpointUiController < ApplicationController
  include LiverampAuthHelper
  before_action :internal?

  def index
    gon.push(
      env: Rails.env,
      protocol_list: Liveramp::Types::TaxonomyService::TaxonomyProtocolConfig::FIELDS.map { |key, config|
        { value: key, label: config.name.titleize }
      },
      macros: TaxonomyEndpointConfig::MACROS.each { |macroKey, macro|
        { value: macroKey, label: macro.label, description: macro.description }
      },
    )
  end
end
