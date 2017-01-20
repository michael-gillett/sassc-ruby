class Api::ThriftController < ApplicationController

  def fetch_struct
    render json: Liveramp::Types::TaxonomyService::TaxonomyProtocolConfig::FIELDS[params[:structKey].to_i][:class]::FIELDS
  end

end
