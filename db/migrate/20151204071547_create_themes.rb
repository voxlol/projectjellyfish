class CreateThemes < ActiveRecord::Migration
  def change
    create_table :themes do |t|
      t.string :name
      t.text :description
      t.string :bg_color, limit: 6
      t.string :text_color, limit: 6

      t.timestamps null: false
    end
  end
end
