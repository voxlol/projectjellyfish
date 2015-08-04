class CreateRegisteredProviders < ActiveRecord::Migration
  def change
    create_table :registered_providers do |t|
      t.timestamps null: false
      t.string :uuid, null: false, index: true
      t.string :name, null: false
      t.text :description
      t.string :cached_tag_list
      t.string :provider_type, null: false
      t.json :questions
    end
  end
end
