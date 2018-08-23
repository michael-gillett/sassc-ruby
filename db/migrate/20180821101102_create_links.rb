class CreateLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :links do |t|
      t.string :alias, null: false
      t.string :url, null: false
      t.string :owner, null: false
      t.text :description
      t.timestamps

      t.index :alias, unique: true
    end
  end
end
