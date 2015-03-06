# == Schema Information
#
# Table name: content_page_revisions
#
#  id               :integer          not null, primary key
#  content_pages_id :integer
#  staff_id         :integer
#  created_at       :datetime
#  updated_at       :datetime
#  title            :string(255)      not null
#  body             :text
#
# Indexes
#
#  index_content_page_revisions_on_content_pages_id  (content_pages_id)
#  index_content_page_revisions_on_staff_id          (staff_id)
#

class ContentPageRevision < ActiveRecord::Base
  belongs_to :content_page
end
