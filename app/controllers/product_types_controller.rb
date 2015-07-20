class ProductTypesController < ApplicationController
  after_action :verify_authorized

  api :GET, '/product_types', 'Returns a list of all product types'

  def index
    authorize ProductType
    render json: ProductType.all, each_serializer: ProductTypeSerializer
  end

  api :GET, '/product_types/:id', 'Returns information on a product type'

  def show
    authorize ProductType
    render json: ProductType.find(params[:type]), serializer: ProductTypeSerializer
  end
end
