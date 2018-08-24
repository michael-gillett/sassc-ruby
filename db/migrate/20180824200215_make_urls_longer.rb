class MakeUrlsLonger < ActiveRecord::Migration[5.0]
  def change
    change_column :links, :url, :text
  end
end
