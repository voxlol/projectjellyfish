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
    allow(ENV).to receive(:fetch).with('JELLYFISH_AWS_ACCESS_KEY_ID').and_return('text')
    allow(ENV).to receive(:fetch).with('JELLYFISH_AWS_SECRET_ACCESS_KEY').and_return('text')
  end
end
