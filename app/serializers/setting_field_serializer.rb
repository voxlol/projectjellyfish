# == Schema Information
#
# Table name: setting_fields
#
#  id           :integer          not null, primary key
#  label        :string(255)
#  field_type   :integer          default(0)
#  help_text    :string(255)
#  options      :json
#  value        :text
#  required     :string(1)
#  load_order   :integer
#  created_at   :datetime
#  updated_at   :datetime
#  setting_id   :integer
#  env_var_name :string(255)
#  disabled     :boolean          default(FALSE)
#  hid          :string(255)      not null
#  secret       :boolean          default(FALSE), not null
#
# Indexes
#
#  index_setting_fields_on_setting_id          (setting_id)
#  index_setting_fields_on_setting_id_and_hid  (setting_id,hid) UNIQUE
#

class SettingFieldSerializer < ApplicationSerializer
  attributes :id, :hid, :setting_id, :label, :help_text, :field_type, :field_options, :value
  attributes :load_order, :required, :disabled, :secret, :value_withheld, :env_var_name

  # Declare a second time to keep position but rename the key
  attribute :field_options, key: :options

  has_one :setting

  def value
    object.secret? ? nil : object.value
  end

  # Useful for letting clients know a value has been set when it is secret
  def value_withheld
    object.secret? && object.value.present?
  end

  # To get around a name clash in ActiveModelSerializer 0.8.0
  def field_options
    object.options
  end
end
