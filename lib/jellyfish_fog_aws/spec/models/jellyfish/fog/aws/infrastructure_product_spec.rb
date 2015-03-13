require 'spec_helper'

module Jellyfish
  module Fog
    module AWS
      describe InfrastructureProduct do
        it 'returns an appropriate provisioner' do
          expect(InfrastructureProduct.new.provisioner).to eq(Infrastructure)
        end
      end
    end
  end
end
