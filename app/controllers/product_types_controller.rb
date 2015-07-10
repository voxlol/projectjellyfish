class ProductTypesController < ApplicationController
  api :GET, '/product_types', 'Returns a collection of product_types'

  def index
    respond_with product_types
  end

  api :GET, '/product_types/:id', 'Shows product_type with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    respond_with product_type
  end

  private

  def product_types
    @_product_types ||= ProductType.all
  end

  def product_type
    @_product_type ||= ProductType.find params[:id]
  end
end
