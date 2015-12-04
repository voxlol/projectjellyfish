# == Schema Information
#
# Table name: themes
#
#  id          :integer          not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  name        :string
#  description :text
#  colors      :json
#

FactoryGirl.define do
  factory :theme do
    name 'Test Theme'
    description 'This is a description of the test theme'
    colors bg: '#EBEBEB', font: '#000000'
  end
end
