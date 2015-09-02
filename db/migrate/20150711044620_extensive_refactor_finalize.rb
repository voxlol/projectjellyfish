class ExtensiveRefactorFinalize < ActiveRecord::Migration
  def up
    drop_table :logs
    drop_table :carts
    drop_table :clouds
    drop_table :project_details
    drop_table :user_setting_options
    drop_table :user_settings
    drop_table :project_answers
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
