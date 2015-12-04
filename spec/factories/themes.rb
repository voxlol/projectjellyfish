# == Schema Information
#
# Table name: themes
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  bg_color    :string(6)
#  text_color  :string(6)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

FactoryGirl.define do
  factory :theme do
    name "MyString"
description "MyText"
bg_color "MyString"
text_color "MyString"
  end

end
