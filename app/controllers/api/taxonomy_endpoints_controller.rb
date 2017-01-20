class Api::TaxonomyEndpointsController < ApplicationController
  include TaxonomyEndpointsHelper

  def index
    begin
      render json: jsonify_endpoints(TAXONOMY_SERVICE.list_taxonomy_endpoints())
    rescue Thrift::ApplicationException, Liveramp::Util::InputOutputException => e
      render json: { message: "Failed to fetch taxonomy endpoints.", error_message: e.message, backtrace: e.backtrace }, status: 500
    end
  end

  def show
    id = params[:id].to_i
    begin
      thrift_config = TAXONOMY_SERVICE.get_taxonomy_endpoint_config(id)
      config_instance = thrift_config.taxonomy_protocol_config.get_value
      thrift_model = config_instance.class::FIELDS
      protocol_attributes = {}
      thrift_model.each do |key, field|
        protocol_attributes[key] = config_instance.send(field.name)
      end
      protocol_name = config_instance.class.name.demodulize.underscore
      protocol_key = Liveramp::Types::TaxonomyService::TaxonomyProtocolConfig::FIELDS.detect { |key, details| details.name == protocol_name }[0]
      required_properties = TAXONOMY_SERVICE.get_required_properties(id)
      render json: { protocol_key: protocol_key, segment_body_format: thrift_config.segment_body_format, protocol_attributes: protocol_attributes, thrift_model: thrift_model, required_properties: required_properties }
    rescue Thrift::ApplicationException, Liveramp::Util::InputOutputException, Liveramp::Util::BadInputException => e
      render json: { message: "Failed to fetch taxonomy endpoint details.", error_message: e.message, backtrace: e.backtrace }, status: 500
    end
  end

  def create
    begin
      new_endpoint_id = create_taxonomy_endpoint(params[:name], build_taxonomy_exchange_config(params[:selectedProtocol], params[:protocolAttributes], params[:segmentBodyFormat]))
      if params[:requiredProperties].present?
        new_required_properties = create_required_properties(new_endpoint_id, build_taxonomy_properties(params[:requiredProperties].values))
      end
      render json: { redirect_to: "/#{new_endpoint_id}", endpoint: { id: new_endpoint_id, name: params[:name], new_required_properties: (new_required_properties || []) } }
    rescue Thrift::ApplicationException, Liveramp::Util::InputOutputException, Liveramp::Util::BadInputException => e
      render json: { message: "Failed to create taxonomy endpoint.", error_message: e.message, backtrace: e.backtrace }, status: 500
    end
  end

  def update
    endpoint_id = params[:id].to_i
    new_required_properties = params[:newRequiredProperties] || {}
    original_required_properties = params[:originalRequiredProperties] || {}

    properties_to_create = []
    properties_to_update = []
    properties_to_delete = []

    new_required_properties.each do |key, property|
      if property.id
        properties_to_update << property if property_is_modified?(original_required_properties[key], property)
      else
        properties_to_create << property
      end
    end

    original_required_properties.each do |key, property|
      properties_to_delete << property.id.to_i if !new_required_properties[key]
    end

    new_required_properties = []

    begin
      if properties_to_create.present?
        new_required_properties = create_required_properties(endpoint_id, build_taxonomy_properties(properties_to_create))
      end
      if properties_to_update.present?
        update_required_properties(build_taxonomy_properties(properties_to_update))
      end
      if properties_to_delete.present?
        delete_required_properties(properties_to_delete)
      end
      update_taxonomy_endpoint(endpoint_id, params[:name], build_taxonomy_exchange_config(params[:selectedProtocol], params[:protocolAttributes], params[:segmentBodyFormat]))
      render json: { redirect_to: "/#{endpoint_id}", endpoint: { id: endpoint_id, name: params[:name], new_required_properties: new_required_properties } }
    rescue Thrift::ApplicationException, Liveramp::Util::InputOutputException, Liveramp::Util::BadInputException => e
      render json: { message: "Failed to update taxonomy endpoint.", error_message: e.message, backtrace: e.backtrace }, status: 500
    end
  end

  def destroy
    begin
      TAXONOMY_SERVICE.delete_taxonomy_endpoint(params[:id].to_i)
      render json: {redirect_to: "/"}
    rescue Thrift::ApplicationException, Liveramp::Util::InputOutputException => e
      render json: { message: "Failed to delete taxonomy endpoint.", error_message: e.message, backtrace: e.backtrace }, status: 500
    end
  end

  private

  def build_taxonomy_exchange_config(protocol_id, thrift_data, segment_body_format)
    protocol_attributes = {}
    protocol_class = Liveramp::Types::TaxonomyService::TaxonomyProtocolConfig::FIELDS[protocol_id.to_i][:class]
    thrift_data.each do |key, value|
      protocol_attributes[protocol_class::FIELDS[key.to_i][:name]] = value
    end

    demodulized_class = protocol_class.name.demodulize.underscore
    taxonomy_protocol_config = Liveramp::Types::TaxonomyService::TaxonomyProtocolConfig.send(
      demodulized_class.to_sym,
      protocol_class.new(protocol_attributes)
    )

    Liveramp::Types::TaxonomyService::TaxonomyExchangeConfig.new({
      segment_body_format: segment_body_format,
      taxonomy_protocol_config: taxonomy_protocol_config
    })
  end

  def build_taxonomy_properties(properties)
    properties.map do |property|
      Liveramp::Types::TaxonomyService::TaxonomyProperty.new({
        id: property.id.to_ion,
        property_name: property.name,
        description: property.description
      })
    end
  end

  def jsonify_endpoints(endpoints)
    endpoints.map{ |endpoint| { id: endpoint.id, name: endpoint.name } }
  end

  def create_taxonomy_endpoint(name, taxonomy_exchange_config)
    taxonomy_endpoint = Liveramp::Types::TaxonomyService::TaxonomyEndpointInfo.new({
      name: name,
      config: taxonomy_exchange_config
    })
    TAXONOMY_SERVICE.create_taxonomy_endpoint(taxonomy_endpoint)
  end

  def update_taxonomy_endpoint(id, name, taxonomy_exchange_config)
    taxonomy_endpoint = Liveramp::Types::TaxonomyService::TaxonomyEndpointInfo.new({
      id: id,
      name: name,
      config: taxonomy_exchange_config
    })
    TAXONOMY_SERVICE.update_taxonomy_endpoint(taxonomy_endpoint)
  end

  def create_required_properties(endpoint_id, required_properties)
    TAXONOMY_SERVICE.create_taxonomy_endpoint_properties(endpoint_id, required_properties)
  end

  def update_required_properties(required_properties)
    TAXONOMY_SERVICE.update_taxonomy_endpoint_properties(required_properties)
  end

  def delete_required_properties(required_properties)
    TAXONOMY_SERVICE.delete_taxonomy_endpoint_properties(required_properties)
  end

end
