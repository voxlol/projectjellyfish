class ExtensiveRefactor < ActiveRecord::Migration
  class Order < ActiveRecord::Base
    belongs_to :staff
    has_many :order_items
  end

  class OrderItem < ActiveRecord::Base
    # Relationships
    belongs_to :order
    belongs_to :product
    belongs_to :cloud
    belongs_to :project

    # Columns
    enum provision_status: { ok: 0, warning: 1, critical: 2, unknown: 3, pending: 4, retired: 5 }
  end

  class Product < ActiveRecord::Base
  end

  def up
    # Create product_listings : Product listings in the marketpalce
    create_table :product_listings do |t|
      t.timestamps null: false
      t.datetime :deleted_at
      t.string :product, index: true, null: false
      t.references :product, index: true, foreign_key: { on_delete: :restrict }, null: false
      t.string :name, null: false
      t.text :description
      t.string :img
      t.boolean :active
      t.decimal :setup_price, precision: 10, scale: 4
      t.decimal :hourly_price, precision: 10, scale: 4
      t.decimal :monthly_price, precision: 10, scale: 4
      t.text :cached_tag_list
    end

    # Create service_orders : Used to record budget utilization
    create_table :service_orders do |t|
      t.timestamps null: false
      t.references :project, index: true, foreign_key: { on_delete: :restrict }, null: false
      t.references :product_listing, index: true, null: false, foreign_key: { on_delete: :destroy }
      t.references :service, index: true, null: false, foreign_key: { on_delete: :destroy }
      t.decimal :setup_price, precision: 10, scale: 4
      t.decimal :hourly_price, precision: 10, scale: 4
      t.decimal :monthly_price, precision: 10, scale: 4
    end

    # Create services : Instances of a product_listing
    create_table :services do |t|
      t.timestamps null: false
      t.string :type, index: true, null: false
      t.string :uuid, index: true, null: false
      t.integer :status
      t.string :status_msg
      t.datetime :fulfilled_at
    end

    # Create settings : Storage of unique application-wide settings
    create_table :settings do |t|
      t.timestamps null: false
      t.string :type, index: true, null: false
      t.string :name, unique: true, null: false
      t.text :description
      t.text :value
      t.integer :value_type, default: 0
      t.text :default
    end

    # Create properties : Collection of properties for objects
    create_table :answers do |t|
      t.timestamps null: false
      t.references :answerable, index: true, null: false, polymorphic: true
      t.string :name, null: false
      t.text :value
      t.integer :value_type
      t.text :default
    end

    # Create properties : Collection of facts for product_instances
    create_table :service_attributes do |t|
      t.timestamps null: false
      t.references :service, index: true, null: false
      t.string :name, null: false
      t.text :value
      t.integer :value_type
    end

    #
    #
    # TODO: Migrate data from all the following tables into the new ones
    #
    # orders into product_instances
    # order_items into product_instances
    # products into product_listings
    #
    #
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
