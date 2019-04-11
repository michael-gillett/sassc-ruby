# frozen_string_literal: true
require 'pkg-config'

namespace :libsass do
  desc "Compile libsass"
  task :compile do
    # Use system library if installed
    sys_libsass = PackageConfig.new('libsass')
    if sys_libsass.exist?
      puts "Using system libsass v#{sys_libsass.version}"
      next
    end

    if Dir.pwd.end_with?('/ext')
      libsass_path = "libsass"
    else
      libsass_path = "ext/libsass"
    end

    cd libsass_path do
      Rake::Task["lib/libsass.so"].invoke
    end
  end

  file "Makefile" do
    sh "git submodule update --init"
  end

  file "lib/libsass.so" => "Makefile" do
    make_program = ENV['MAKE']
    make_program ||= case RUBY_PLATFORM
                     when /mswin/
                       'nmake'
                     when /(bsd|solaris)/
                       'gmake'
                     else
                       'make'
                     end
    sh "#{make_program} lib/libsass.so"
  end
end
