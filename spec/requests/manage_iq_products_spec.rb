require 'rails_helper'

RSpec.describe 'Manage IQ Products API' do
  let(:default_params) { { format: :json } }

  describe 'PUT update' do
    it 'updates a product', :show_in_doc do
      @manage_iq_product = create(:manage_iq_product, product: build(:product))
      sign_in_as create :staff, :admin

      put "/api/v1/manage_iq_products/#{@manage_iq_product.id}", options: ['test']

      expect(response.status).to eq(204)
    end

    it 'returns an error when the product does not exist' do
      @manage_iq_product = create(:manage_iq_product, product: build(:product))
      sign_in_as create :staff, :admin

      put "/api/v1/manage_iq_products/#{@manage_iq_product.id + 999}", options: ['test']

      expect(response.status).to eq(404)
      expect(json).to eq('error' => 'Not found.')
    end
  end

  describe 'POST create' do
    before :each do
      sign_in_as create :staff, :admin
    end

    it 'creates an product', :show_in_doc do
      post '/api/v1/manage_iq_products/', options: ['test']
      expect(Product.first).to be_present
      expect(response.body).to eq(ManageIqProduct.first.to_json)
    end
  end
end
