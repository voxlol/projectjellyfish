class ModuleProductsRefactor < ActiveRecord::Migration
  def change
    # # Update orders : Orders are limited to a single project now
    # remove_column :orders, :engine_response, :text
    # remove_column :orders, :active, :boolean
    # remove_column :orders, :options, :jsonb
    # remove_column :orders, :total
    # add_reference :orders, :project, index: true, foreign_key: { on_delete: :restrict }
    # add_column :orders, :total, :decimal, precision: 10, scale: 2
    # add_column :orders, :status, :integer
    # add_column :orders, :status_msg, :string
    #
    # # Update order_items : OrderItems are being split into OrderItems and ProductInstances
    # remove_column :order_items, :cloud_id, :integer, index: true
    # remove_column :order_items, :service_id, :integer, index: true
    # remove_column :order_items, :provision_status, :integer
    # remove_column :order_items, :project_id, :integer
    # remove_column :order_items, :miq_id, :integer, index: true
    # remove_column :order_items, :uuid, :uuid
    # remove_column :order_items, :payload_request, :jsonb
    # remove_column :order_items, :payload_response, :jsonb
    # remove_column :order_items, :payload_acknowledgement, :jsonb
    # remove_column :order_items, :status_msg, :string
    # add_column :order_items, :total, :decimal, precision: 8, scale: 2

    # Update clouds : Make them sources of configuration
    remove_column :clouds, :extra, :text
    add_column :clouds, :settings, :json
    add_column :clouds, :properties, :json

    # # Update product_types : This table is going to be populated with types from modules
    # remove_column :product_types, :questions_form_schema, :json
    # add_reference :product_types, :cloud, foreign_key: { on_delete: :restrict }, null: false
    # add_column :product_types, :type, :string, null: false
    # add_column :product_types, :classification, :string
    # add_column :product_types, :uuid, :string, null: false
    # add_column :product_types, :img, :string
    # add_column :product_types, :version, :string, null: false
    # add_column :product_types, :active, :boolean, default: true, null: false
    # add_column :product_types, :settings, :json
    # add_index :product_types, :cloud_id
    # add_index :product_types, :uuid, unique: true

    # Update products : Refactor columns into Rails opinionated names
    remove_column :products, :provisioning_answers, :jsonb
    remove_column :products, :product_type, :string
    add_reference :products, :product_type, index: true, foreign_key: { on_delete: :restrict }, null: false
    add_column :products, :type, :string, null: false
    add_column :products, :properties, :json

    # Create product_instances
    create_table :product_instances do |t|
      t.timestamps null: false
      t.string :type, null: false
      t.references :project, index: true, foreign_key: { on_delete: :restrict }, null: false
      t.references :product, index: true, foreign_key: { on_delete: :restrict }, null: false
      t.integer :status
      t.string :status_msg
      t.json :properties
      t.json :reported_properties
      t.datetime :fulfilled_at
    end

    # Create settings : Storage of unique application-wide settings
    create_table :settings do |t|
      t.timestamps null: false
      t.string :category, index: true
      t.string :name, unique: true, null: false
      t.text :value
      t.integer :value_type
      t.text :default
    end

    # Create properties : Collection of properties for objects
    create_table :properties do |t|
      t.timestamps null: false
      t.references :propable, index: true, polymorphic: true
      t.string :name, null: false
      t.text :value
      t.integer :value_type
      t.text :default
    end
  end
end
