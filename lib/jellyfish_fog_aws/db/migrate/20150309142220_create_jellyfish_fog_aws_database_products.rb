class CreateJellyfishFogAwsDatabaseProducts < ActiveRecord::Migration
  def change
    create_table :jellyfish_fog_aws_database_products do |t|
      t.timestamps
      t.string :db_instance_class
      t.string :engine
      t.string :allocated_storage
    end
  end
end
