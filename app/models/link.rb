class Link < ActiveRecord::Base
  validates :url, url: true
end
