# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Rails.application.initialize!
ActiveRecord::Base.default_timezone = :local

require 'rap_support/core_ext/active_record_extension' # Support for 'enum'
require 'rap_support/core_ext/mysql_adapter_extension'
