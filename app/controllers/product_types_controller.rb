class ProductTypesController < ApplicationController
  api :GET, '/product_types', 'Returns a collection of product_types'

  def index
    respond_with_params ProductType.schemas
  end

  api :GET, '/product_types/:id', 'Shows product_type with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    product_type = ProductType.new(params[:id])
    respond_with_params product_type
  end
end
