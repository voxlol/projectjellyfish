# == Schema Information
#
# Table name: content_pages
#
#  id         :integer          not null, primary key
#  staff_id   :integer
#  created_at :datetime
#  updated_at :datetime
#  deleted_at :datetime
#  title      :string(255)      not null
#  slug       :string(255)      not null
#  body       :text
#
# Indexes
#
#  index_content_pages_on_slug      (slug) UNIQUE
#  index_content_pages_on_staff_id  (staff_id)
#

class ContentPage < ActiveRecord::Base
  acts_as_paranoid

  has_many :content_page_revisions, foreign_key: 'content_pages_id'
  attr_accessor :content_page_revisions_attributes
  accepts_nested_attributes_for :content_page_revisions

  #after_save :create_content_page_revision
  #after_save {|instance| Rails.logger.debug instance.inspect }

  private

  def create_content_page_revision
    Rails.logger.debug ap self
    #Rails.logger.debug ap params
    #ContentPageRevision.create self.
    self.content_page_revisions.create
  end
end
