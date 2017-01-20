module TaxonomyEndpointsHelper
  def property_is_modified?(original_property, new_property)
    return (
      original_property.name != new_property.name ||
      original_property.description != new_property.description
    )
  end
end
