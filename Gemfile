source 'http://gemserver.liveramp.net'

# Core dependencies
gem 'rails', '4.2.5'
gem 'redis-rails', '4.0.0'
gem 'haml', '~> 4.0'
gem 'sass-rails', '~> 5.0'
gem 'sprockets-rails', '~> 2.0'
gem 'uglifier', '~> 2.7'
gem 'jquery-rails'
gem 'turbolinks'
gem 'jbuilder', '~> 2.0'
gem 'mysql2', '~> 0.4.2'
gem 'newrelic_rpm', '~> 3.14'

# First party dependencies
gem 'rails_logger', git: 'git@git.liveramp.net:RailsRepos/rails_logger.git'
gem 'rldb', git: 'git@git.liveramp.net:MasterRepos/db_schemas.git', glob: '**/rldb.gemspec'
gem 'protected_attributes', '~> 1.1'
gem 'rap_support'

# Optional dependencies




# Production dependencies
group :production do
  gem 'exception_notification', '~> 4.1'
end

# Developement and test dependencies
group :development do
  gem 'puma'
  gem 'passenger'
  gem 'spring'
  gem 'spring-commands-rspec'

  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'web-console'

  gem 'turbo_dev_assets'
  gem 'quiet_assets'
  gem 'rails-dev-tweaks'
end

group :development, :test do
  gem 'pry-byebug'
  gem 'pry-rails'
  gem 'letter_opener'
  gem 'awesome_print'

  gem 'rspec-rails', '~> 3.0'
  gem 'factory_girl_rails', '~> 4.0'
end
