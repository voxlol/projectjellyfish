require 'spec_helper'

module Jellyfish
  module Fog
    module AWS
      describe Databases do
        it 'provisions infrastructure using fog' do
          enable_aws_fog_provisioning

          Databases.new(order_item).provision

          expect(order_item.instance_name).to eq 'id-1234567890'
          expect(order_item.password).to be_present
          expect(order_item.username).to eq 'admin'
          expect(order_item.provision_status).to eq 'ok'
          expect(order_item.payload_response).to be_present
        end

        def order_item
          @order_item ||= OpenStruct.new.tap do |order_item|
            order_item.uuid = '1234567890'
            order_item.answers = {
              'AllocatedStorage' => 100,
              'DBInstanceClass' => 'Test',
              'Engine' => 'Test'
            }
          end
        end

        def enable_aws_fog_provisioning
          ::Fog.mock!
          allow_any_instance_of(::Provisioner).to receive(:aws_settings).and_return(
            access_key: 'text', secret_key: 'text'
          )
        end
      end
    end
  end
end
