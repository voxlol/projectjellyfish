require 'spec_helper'

module Jellyfish
  module Fog
    module AWS
      describe Infrastructure do
        it 'provisions infrastructure using fog' do
          enable_aws_fog_provisioning

          Infrastructure.new(order_item).provision

          expect(order_item.provision_status).to eq 'ok'
          expect(order_item.payload_response).to be_present
        end

        def order_item
          @order_item ||= OpenStruct.new.tap do |order_item|
            order_item.answers = {}
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
