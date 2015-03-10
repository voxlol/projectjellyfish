class ProductsController < ApplicationController
  after_action :verify_authorized
  after_action :post_hook

  before_action :pre_hook
  before_action :load_product, only: [:show, :update, :destroy]
  before_action :load_products, only: [:index]
  before_action :load_answers, only: [:answers]

  PRODUCT_PRICE_REGEX = /\d{1,6}(\.\d{0,4})?/

  api :GET, '/products', 'Returns a collection of products'
  param :page, :number, required: false
  param :per_page, :number, required: false
  param :active, :bool, required: false
  param :includes, Array, required: false, in: %w(chargebacks product_type answers)

  def index
    authorize Product
    respond_with_params @products
  end

  api :GET, '/products/:id', 'Shows product with :id'
  param :id, :number, required: true
  param :includes, Array, required: false, in: %w(chargebacks product_type answers)
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    authorize @product
    respond_with_params @product
  end

  api :DELETE, '/products/:id', 'Deletes product with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    authorize @product
    @product.destroy
    respond_with @product
  end

  def answers
    authorize @product
    respond_with @answers
  end

  private

  def load_product
    @product = Product.find(params.require(:id))
  end

  def load_products
    query = Product.all.tap { |q| q.where!(active: params[:active]) unless params[:active].nil? }
    @products = query_with query, :includes, :pagination
  end

  def load_answers
    load_product
    @answers = @product.answers
  end

  def pre_hook
    ActiveSupport::Notifications.instrument(controller_name + '#' + action_name + '/pre_hook')
  end

  def post_hook
    ActiveSupport::Notifications.instrument(controller_name + '#' + action_name + '/post_hook')
  end
end
