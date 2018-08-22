class Link < ActiveRecord::Base
  validates :url, url: true
  validates :alias, uniqueness: true
  before_save :change_alias_underscores_to_dashes

  private
  def change_alias_underscores_to_dashes
    self.alias.gsub!("_", "-")
  end
end
