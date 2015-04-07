require 'rails_helper'

describe Jellyfish::Fog::AWS do
  it 'provisions a new storage product' do
    create_aws_settings

    Jellyfish::Fog::AWS::Storage.new(order_item).provision

    expect(order_item.provision_status).to eq('ok')
  end

  def order_item
    @order_item ||= OpenStruct.new(
      'uuid' => '1234567890',
      'cloud_service_name' => 'testjellyfish',
      'aws_settings' => {
        'access_key' => 'key',
        'secret_key' => 'secret'
      }
    )
  end

  def create_aws_settings
    create(
      :setting,
      hid: 'aws',
      setting_fields: [
        build(:setting_field, hid: 'access_key', value: 'key'),
        build(:setting_field, hid: 'secret_key', value: 'value')
      ]
    )
  end
end
