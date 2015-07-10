class ProductInstanceController < ApplicationController
  after_action :verify_authorized

  def show
    respond_with product_instance
  end

  def create
    product_instance = ProductInstance.new product_instance_params
  end

  def update

  end

  private

  def product_instance_params

  end

  def product_instance
    @_product_instance = ProductInstance.find(params[:id]).tap { |pi| authorize pi }
  end
end
