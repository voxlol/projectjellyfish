require 'rails_helper'

RSpec.describe 'Projects API' do
  describe 'GET index' do
    it 'returns a collection of all product types' do
      sign_in_as create(:staff, :admin)

      get 'api/v1/product_types'

      expect(json).to eq ProductType.all.values
    end
  end
end
