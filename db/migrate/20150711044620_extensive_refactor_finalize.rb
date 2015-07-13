class ExtensiveRefactorFinalize < ActiveRecord::Migration
  def up
    drop_table :logs
    drop_table :orders
    drop_table :order_items
    drop_table :carts
    drop_table :clouds
    drop_table :product_types
    drop_table :products
    drop_table :user_setting_options
    drop_table :user_settings
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
