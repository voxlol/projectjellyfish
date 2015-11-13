# == Schema Information
#
# Table name: logs
#
#  id            :integer          not null, primary key
#  log_level     :integer
#  message       :string
#  loggable_type :string
#  loggable_id   :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

FactoryGirl.define do
  factory :log do
    log_level 1
message "MyString"
loggable_type "MyString"
loggable_id 1
  end

end
