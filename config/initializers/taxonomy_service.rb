# Be sure to restart your server when you modify this file.

require 'rapleaf_types/taxonomy_service'
require 'taxonomy_client'

if Rails.env.production?
  TAXONOMY_SERVICE = TaxonomyClient.new('taxonomy_service.service.consul')
else
  TAXONOMY_SERVICE = TaxonomyClient.new('localhost', 11337)
end
