class AddColumnsToStaff < ActiveRecord::Migration
  def change
    add_column :staff, :provider, :string
    add_column :staff, :uid, :string
  end
end
