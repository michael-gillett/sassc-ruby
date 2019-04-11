# frozen_string_literal: true

lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "sassc/version"

Gem::Specification.new do |spec|

  spec.name          = "sassc"
  spec.version       = SassC::VERSION
  spec.authors       = ["Ryan Boland"]
  spec.email         = ["ryan@tanookilabs.com"]
  spec.summary       = "Use libsass with Ruby!"
  spec.description   = "Use libsass with Ruby!"
  spec.homepage      = "https://github.com/sass/sassc-ruby"
  spec.license       = "MIT"

  spec.files         = Dir['**/*']
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})

  spec.required_ruby_version = ">= 2.3.3"

  spec.require_paths = ["lib"]

  spec.extensions    = ["ext/Rakefile"]

  spec.add_development_dependency "minitest", "~> 5.5.1"
  spec.add_development_dependency "minitest-around"
  spec.add_development_dependency "test_construct"
  spec.add_development_dependency "pry"
  spec.add_development_dependency "bundler"

  spec.add_dependency "pkg-config"
  spec.add_dependency "rake"
  spec.add_dependency "ffi", "~> 1.9"

end
