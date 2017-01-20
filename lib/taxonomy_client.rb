require 'rapleaf_lib/thrift_service_wrapper'
require 'rapleaf_types/taxonomy_service'

class TaxonomyClient < Rapleaf::ThriftServiceWrapper
  def initialize(host, port = nil, timeout = 60)
    super(Liveramp::Types::TaxonomyService::TaxonomyService, Thrift::CompactProtocolFactory.new, host, port, true, timeout)
  end
end
