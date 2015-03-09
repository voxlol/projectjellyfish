require 'spec_helper'

module Jellyfish
  module Fog
    module AWS
      describe StorageProduct do
        it 'returns an appropriate provisioner' do
          expect(StorageProduct.new.provisioner).to eq(Storage)
        end
      end
    end
  end
end
