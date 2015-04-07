require 'rails_helper'
require 'jellyfish_fog_azure'

describe 'Jellyfish::Fog::Azure' do
  ENV['JF_AZURE_SUB_ID'] = 'abcdefg'
  ENV['JF_AZURE_PEM_PATH'] = 'azure-cert.pem'
  ENV['JF_AZURE_API_URL'] = 'https://management.core.windows.net'

  it 'provisions a new infrastructure product' do
    Jellyfish::Fog::Azure::Mock.new.mock!
    azure_settings
    order_item = infrastructure_order_item

    Jellyfish::Fog::Azure::Infrastructure.new(order_item).provision

    expect(order_item.provision_status).to eq(:ok)
  end

  it 'provisions a new storage product' do
    Jellyfish::Fog::Azure::Mock.new.mock!
    azure_settings
    order_item = storage_order_item

    Jellyfish::Fog::Azure::Storage.new(order_item).provision

    expect(order_item.provision_status).to eq(:ok)
  end

  it 'creates a new connection' do
    Jellyfish::Fog::Azure::Mock.new.mock!

    connection = Jellyfish::Fog::Azure::Connection.new.connect

    expect(connection).to be_a_kind_of(::Fog::Compute::Azure::Mock)
  end

  def infrastructure_order_item
    @order_item ||= OpenStruct.new(
      uuid: '1234567890',
      answers: {
        'certificate_file' => 'azure-cert.cer',
        'cloud_service_name' => 'testjellyfish',
        'image' => 'the_image',
        'location' => 'East Asia',
        'private_key_file' => 'azure-cert.pem',
        'vm_name' => 'jellyfish_vm',
        'vm_user' => 'admin'
      }
    )
  end

  def storage_order_item
    @order_item ||= OpenStruct.new(
      uuid: '1234567890',
      id: 1,
      answers: { 'location' => 'East Asia' }
    )
  end

  def azure_settings
    create(
      :setting,
      hid: 'azure',
      setting_fields: [
        build(:setting_field, hid: 'sub_id', value: 'abcdefg'),
        build(:setting_field, hid: 'pem_path', value: 'azure-cert.pem'),
        build(:setting_field, hid: 'api_url', value: 'https://management.core.windows.net')
      ]
    )
  end
end
