namespace :app do
  task :test do
    raise "blah" unless system "bundle exec rake db:create db:migrate"
    raise "blah" unless system "bundle exec rspec"
  end
end
