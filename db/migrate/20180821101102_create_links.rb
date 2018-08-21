class CreateLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :links do |t|
      t.string :alias
      t.string :url
      t.string :owner
      t.text :description
      t.timestamps
    end
  end
end
