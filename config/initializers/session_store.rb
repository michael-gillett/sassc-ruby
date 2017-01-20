if 'production' == Rails.env && File.exists?("#{Rails.root}/config/redis.yml")
  redis_servers = YAML.load_file("#{Rails.root}/config/redis.yml")['redis_servers'].values
  redis_servers.push({ namespace: "session" })
  Rails.application.config.session_store :redis_store,
                                          redis_server: redis_servers
else
  Rails.application.config.session_store :cookie_store, :key => '_dev_session_id'
end
