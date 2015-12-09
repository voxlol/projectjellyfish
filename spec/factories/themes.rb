# == Schema Information
#
# Table name: themes
#
#  id          :integer          not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  name        :string
#  description :text
#  config      :json             default([]), is an Array
#

FactoryGirl.define do
  factory :theme do
    name 'Test Theme'
    description 'This is a description of the test theme'
    config [{
      type: 'group',
      name: 'modal',
      children: [{
        type: 'style',
        label: 'body bg color',
        selector: 'body',
        rule: 'background-color',
        value: '#FFFFFF'
      }]
    }]
  end
end
