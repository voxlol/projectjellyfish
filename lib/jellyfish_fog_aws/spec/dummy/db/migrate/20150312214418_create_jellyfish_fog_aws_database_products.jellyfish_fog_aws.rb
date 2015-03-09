# This migration comes from jellyfish_fog_aws (originally 20150309142220)
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
