require 'spec_helper'

module Jellyfish
  module Fog
    module AWS
      describe 'Registering product types' do
        it 'registers all product types' do
          expect(Dummy::Application.config.x.product_types).to have_key('AWS Database')
        end
      end
    end
  end
end
