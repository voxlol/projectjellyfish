class ProductTypesController < ApplicationController
  after_action :verify_authorized

  def index
    authorize ProductType
    render json: ProductType.all
  end

  def show
    authorize ProductType
    render json: ProductType.find(params[:type])
  end
end
