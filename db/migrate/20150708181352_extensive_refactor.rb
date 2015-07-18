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
    # Create properties : Collection of properties for objects
    create_table :answers do |t|
      t.timestamps null: false
      t.references :answerable, index: true, null: false, polymorphic: true
      t.string :name, null: false
      t.text :value
      t.integer :value_type
      t.text :default
    end

    # # Create product_listings : Product listings in the marketplace
    # create_table :product_listings do |t|
    #   t.timestamps null: false
    #   t.datetime :deleted_at
    #   t.string :product_type, index: true, null: false
    #   t.string :name, null: false
    #   t.text :description
    #   t.string :img
    #   t.boolean :active, null: false, default: true
    #   t.decimal :setup_price, precision: 10, scale: 4
    #   t.decimal :hourly_price, precision: 10, scale: 4
    #   t.decimal :monthly_price, precision: 10, scale: 4
    #   t.text :cached_tag_list
    # end
    #
    # TODO: Migrate products.provisioning_answers to answers
    remove_column :products, :provisioning_answers, :jsonb
    change_column_null :products, :name, false
    change_column_null :products, :product_type, false
    add_index :products, :product_type

    # Create services : Instances of a product_listing
    create_table :services do |t|
      t.timestamps null: false
      t.string :type, index: true, null: false
      t.string :product_type, index: true, null: false
      t.string :uuid, index: true, null: false
      t.integer :status
      t.string :status_msg
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
    # orders & order_items into services & service_orders
    # products into product_listings
    #
    #

    drop_table :orders
    drop_table :order_items

    # Create orders : Used to record budget utilization
    create_table :orders do |t|
      t.timestamps null: false
      t.references :project, index: true, null: false, foreign_key: { on_delete: :cascade }
      t.references :product, index: true, null: false, foreign_key: { on_delete: :cascade }
      t.references :service, index: true, unique: true, null: false, foreign_key: { on_delete: :cascade }
      t.decimal :setup_price, precision: 10, scale: 4
      t.decimal :hourly_price, precision: 10, scale: 4
      t.decimal :monthly_price, precision: 10, scale: 4
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
