# == Schema Information
#
# Table name: motds
#
#  id         :integer          not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  deleted_at :datetime
#  staff_id   :integer
#  message    :text
#
# Indexes
#
#  index_motds_on_staff_id  (staff_id)
#

FactoryGirl.define do
  factory :motd do
    message "MyText"
    staff_id 1
  end
end
