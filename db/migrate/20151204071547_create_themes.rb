class CreateThemes < ActiveRecord::Migration
  def change
    create_table :themes do |t|
      t.timestamps null: false

      t.string :name
      t.text :description
      t.json :config, array: true, default: []
    end
  end
end