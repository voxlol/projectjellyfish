class JellyfishFogAwsStorageProducts < ActiveRecord::Migration
  def change
    create_table :jellyfish_fog_aws_storage_products do |t|
      t.timestamps
      t.string :availability
      t.string :region
    end
  end
end
