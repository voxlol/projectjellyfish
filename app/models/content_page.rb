# == Schema Information
#
# Table name: content_pages
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  deleted_at :datetime
#  staff_id   :integer
#  slug       :string           not null
#  title      :string           not null
#  body       :text
#
# Indexes
#
#  index_content_pages_on_slug      (slug) UNIQUE
#  index_content_pages_on_staff_id  (staff_id)
#

class ContentPage < ActiveRecord::Base
  acts_as_paranoid
  acts_as_taggable

  belongs_to :staff

  extend FriendlyId
  friendly_id :title, use: [:slugged, :finders]
  has_paper_trail
end
