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

  belongs_to :staff

  extend FriendlyId
  friendly_id :title, use: [:slugged, :finders]
  has_paper_trail
end
