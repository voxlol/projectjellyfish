require 'rails_helper'

RSpec.describe 'Order Items API' do
  let(:default_params) { { format: :json } }
  let(:project) { create :project }
  let(:product) { create :product }

  before(:each) do
    @order = Order.create(staff_id: 1, order_items_attributes: [{ product_id: product.id, project_id: project.id }, { product_id: create(:product).id, project_id: create(:project).id }])
    sign_in_as create :staff, :admin
    @order_item = @order.order_items.first
  end

  describe 'GET show' do
    it 'returns an order item', :show_in_doc do
      get "/api/v1/order_items/#{@order_item.id}"
      expect(json['product_id']).to eq(@order_item.product_id)
      expect(json['project_id']).to eq(@order_item.project_id)
    end

    it 'returns an error when the order item does not exist' do
      get "/api/v1/order_items/#{@order_item.id + 999}"
      expect(response.status).to eq(404)
      expect(json).to eq('error' => 'Not found.')
    end
  end

  describe 'PUT update' do
    it 'update an order item', :show_in_doc do
      put "/api/v1/order_items/#{@order_item.id}", hourly_price: 5, monthly_price: 125
      expect(response.status).to eq(204)
    end

    it 'returns an error when the order item does not exist' do
      get "/api/v1/order_items/#{@order_item.id + 999}"
      expect(response.status).to eq(404)
      expect(json).to eq('error' => 'Not found.')
    end
  end

  describe 'DELETE destroy' do
    before :each do
      @order = Order.create(staff_id: 1, order_items_attributes: [{ product_id: product.id, project_id: project.id }])
      @order_item = @order.order_items.first
    end

    it 'removes the order item', :show_in_doc do
      delete "/api/v1/order_items/#{@order_item.id}"
      expect(response.status).to eq(204)
    end

    it 'returns an error when the order item does not exist' do
      delete "/api/v1/order_items/#{@order_item.id + 999}"
      expect(response.status).to eq(404)
      expect(json).to eq('error' => 'Not found.')
    end
  end
end
