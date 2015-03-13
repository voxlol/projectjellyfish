# This migration comes from jellyfish_fog_aws (originally 20150309192000)
class JellyfishFogAwsStorageProducts < ActiveRecord::Migration
  def change
    create_table :jellyfish_fog_aws_storage_products do |t|
      t.timestamps
      t.string :availability
      t.string :region
    end
  end
end
