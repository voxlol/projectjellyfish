# == Schema Information
#
# Table name: settings
#
#  id   :integer          not null, primary key
#  name :string(255)
#  hid  :string(255)      not null
#
# Indexes
#
#  index_settings_on_hid  (hid) UNIQUE
#

class SettingSerializer < ApplicationSerializer
  attributes :id, :name, :hid

  has_many :setting_fields
end
