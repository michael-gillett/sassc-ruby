class Link < ActiveRecord::Base
  validates :url_with_scrubbed_param_flag, url: true
  validates :alias, uniqueness: true
  before_save :change_alias_underscores_to_dashes

  private

  def change_alias_underscores_to_dashes
    self.alias.gsub!("_", "-")
  end

  def url_with_scrubbed_param_flag
    self.url&.gsub(GoLinksUiController::PARAM_FLAG, "param")
  end
end
