module AwsSettingHelpers
  def enable_aws_fog_provisioning
    create(
      :setting,
      hid: 'manageiq',
      setting_fields: [
        build(:setting_field, hid: 'enabled', field_type: 'check_box', value: 'false')
      ]
    )

    create(
      :setting,
      hid: 'aws',
      setting_fields: [
        build(:setting_field, hid: 'access_key', value: 'test'),
        build(:setting_field, hid: 'secret_key', value: 'test')
      ]
    )
  end
end
