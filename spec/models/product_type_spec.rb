require 'rails_helper'

describe ProductType do
  describe 'schema' do
    it 'finds the config entry and returns it' do
      Rails.application.config.x.product_types.merge!('Name' => 'expected')

      expect(ProductType.new('Name').schema).to eq 'expected'
    end
  end
end
