class CreateLogs < ActiveRecord::Migration
  def change
    drop_table :logs

    create_table :logs do |t|
      t.integer :log_level
      t.string :message
      t.string :loggable_type
      t.integer :loggable_id

      t.timestamps null: false
    end
  end
end
