require 'rails_helper'

describe ProductType do
  describe 'schema' do
    it 'finds the config entry and products with tags' do
      Rails.application.config.x.product_types.merge!('Name' => {})
      create(:product, product_type: 'Name', tag_list: %w(tag))

      expect(ProductType.new('Name').schema).to eq(tags: ['tag'])
    end
  end
end
