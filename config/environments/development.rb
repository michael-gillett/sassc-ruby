Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.default_url_options = { host: 'localhost:3000' }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = false

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Speed up local development by not reloading models on certain requests
  config.dev_tweaks.autoload_rules do
    keep :all
    skip '/favicon.ico'
    skip :assets
    # skip :xhr
    keep :forced
  end
  config.middleware.insert 0, TurboDevAssets
  config.eager_load = false
end

require 'rap_support/core_ext/migration_extension'

NFS_PATH = ''
CUSTOMER_HOME = '/data/customer/'

# Log ActiveRecord queries to STDOUT if in console
if ['irb', 'script/rails'].include?($0)
  ActiveRecord::Base.logger = Logger.new(STDOUT)
end

# Disable ActiveRecord debug logging if in server
# if ['script/rails'].include?($0)
#   ActiveRecord::Base.logger = Logger.new('/dev/null')
# end
