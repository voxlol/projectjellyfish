class CreateJellyfishFogAwsInfrastructureProducts < ActiveRecord::Migration
  def change
    create_table :jellyfish_fog_aws_infrastructure_products do |t|
      t.timestamps
      t.string :instance_size
      t.string :disk_size
    end
  end
end
