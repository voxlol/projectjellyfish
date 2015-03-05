class CreateContentPageRevisions < ActiveRecord::Migration
  def change
    create_table :content_page_revisions do |t|
      t.references :content_pages, index: true
      t.references :staff, index: true

      t.timestamps

      t.string :title, null: false
      t.text :body
    end
  end
end
