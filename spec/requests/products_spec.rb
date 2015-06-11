require 'rails_helper'

RSpec.describe 'Products API' do
  let(:default_params) { { format: :json } }

  describe 'GET index' do
    before(:each) do
      @product = create(:product)
      sign_in_as create :staff
      @products = Product.all
    end

    it 'returns a collection of all of the products', :show_in_doc do
      get '/api/v1/products'
      expect(json.map { |product| product['id'] }).to eq(@products.map(&:id))
    end

    it 'paginates the products' do
      get '/api/v1/products', page: 1, per_page: 1
      expect(json.length).to eq(1)
    end

    it 'verifies tags can be viewed from products' do
      test_tag = 'foobar'

      # VERIFY PRODUCT HAS NO TAGS
      expect(@product.tag_list.count).to eq(0)

      # ADD TEST TAG TO PRODUCT
      post "/api/v1/products/#{@product.id}/tags", tag_list: [test_tag], product_id: @product.id

      # VERIFY TAG WAS SAVED - (REQUERY PRODUCT B/C IT IS OUT OF SYNC WITH DB NOW)
      @product = Product.where(id: @product.id).first
      expect(@product.tag_list.count).to eq(1)
      expect(@product.tag_list).to include(test_tag)

      # VERIFY TAG IS RETURNED FROM PRODUCTS ENDPOINT WITH METHODS URL PARAMETER SPECIFIED
      get "/api/v1/products/#{@product.id}", tags: [test_tag]
      expect(json['tags']).to include(test_tag)
    end
  end

  describe 'GET show' do
    before(:each) do
      @product = create :product
      sign_in_as create :staff
    end

    it 'returns an product', :show_in_doc do
      get "/api/v1/products/#{@product.id}"
      expect(json['id']).to eq(@product.id)
    end

    it 'returns an error when the product does not exist' do
      get "/api/v1/products/#{@product.id + 999}"
      expect(response.status).to eq(404)
      expect(json).to eq('error' => 'Not found.')
    end
  end

  describe 'DELETE destroy' do
    before :each do
      @product = create :product
      sign_in_as create :staff, :admin
    end

    it 'removes the product', :show_in_doc do
      delete "/api/v1/products/#{@product.id}"
      expect(response.status).to eq(204)
    end

    it 'returns an error when the product does not exist' do
      delete "/api/v1/products/#{@product.id + 999}"
      expect(response.status).to eq(404)
      expect(json).to eq('error' => 'Not found.')
    end
  end

  describe 'POST create' do
    it 'maps provisioning_answers to a hash' do
      sign_in_as create :staff, :admin
      product_attributes = attributes_for(
        :product,
        'provisioning_answers[foo]' => 'bar',
        'provisioning_answers[baz]' => 'bat',
        'provisioning_answers[DBInstanceClass]' => 'db.m3.medium',
        'provisioning_answers[AllocatedStorage]' => '40',
        'provisioning_answers[Engine]' => 'mysql'
      )

      post products_path, product_attributes

      expect(response).to be_success
      expect(Product.last.provisioning_answers).to eq 'foo' => 'bar', 'baz' => 'bat', 'DBInstanceClass' => 'db.m3.medium', 'AllocatedStorage' => '40', 'Engine' => 'mysql'
    end
  end
end
