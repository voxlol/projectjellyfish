# == Schema Information
#
# Table name: authentications
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  staff_id   :integer
#  provider   :string(255)
#  uid        :string(255)
#
# Indexes
#
#  index_authentications_on_provider_and_uid  (provider,uid)
#  index_authentications_on_staff_id          (staff_id)
#

class Authentications < ActiveRecord::Base
  belongs_to :staff

  validates :provider, :uid, presence: true
end
