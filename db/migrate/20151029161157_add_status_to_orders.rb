class AddStatusToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :status, :integer
    add_column :orders, :status_msg, :string
  end
end
