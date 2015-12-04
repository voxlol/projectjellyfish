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

class ThemeSerializer < ApplicationSerializer
  attributes :name, :description, :colors
  attributes :created_at, :updated_at
end
