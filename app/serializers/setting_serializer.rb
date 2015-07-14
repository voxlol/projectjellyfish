# == Schema Information
#
# Table name: settings
#
#  id          :integer          not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  type        :string           not null
#  name        :string           not null
#  description :text
#  value       :text
#  value_type  :integer          default(0)
#  default     :text
#
# Indexes
#
#  index_settings_on_type  (type)
#

class SettingSerializer < ApplicationSerializer
  attributes :id, :name, :value

  def value
    nil if object.password?
  end
end
