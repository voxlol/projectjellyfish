require 'rails_helper'

def find_gem(name)
  Gem::Specification.find_by_name(name)
  true
rescue Gem::LoadError
  false
end

def infrastructure_order_item
  @order_item ||= OpenStruct.new.tap do |order_item|
    order_item.uuid = '1234567890'
    order_item.answers = {
      'vm_name' => 'jellyfish_vm',
      'vm_user' => 'admin',
      'image' => '0b11de9248dd4d87b18621318e037d37__RightImage-CentOS-6.2-x64-v5.8.8.1',
      'location' => 'East Asia',
      'cloud_service_name' => 'testjellyfish',
      'certificate_file' => 'azure-cert.cer',
      'private_key_file' => 'azure-cert.pem'
    }
  end
end

def storage_order_item
  @order_item ||= OpenStruct.new.tap do |order_item|
    order_item.uuid = '1234567890'
    order_item.id = 1
    order_item.answers = {
      'location' => 'East Asia',
    }
  end
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

if find_gem('jellyfish-azure')
  require 'jellyfish_fog_azure'
  describe Jellyfish::Fog::Azure do
    it 'provisions a new infrastructure product' do
      Jellyfish::Fog::Azure::Mock.new.mock!
      azure_settings
      order_item = infrastructure_order_item
      item = Jellyfish::Fog::Azure::Infrastructure.new(order_item)
      item.provision
      expect(order_item.provision_status).to eq(:ok)
    end

    it 'provisions a new storage product' do
      Jellyfish::Fog::Azure::Mock.new.mock!
      azure_settings
      order_item = storage_order_item
      item = Jellyfish::Fog::Azure::Storage.new(order_item)
      item.provision
      expect(order_item.provision_status).to eq(:ok)
    end
  end
end
