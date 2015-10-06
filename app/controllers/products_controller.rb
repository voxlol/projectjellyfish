class ProductsController < ApplicationController
  PRODUCT_INCLUDES = %w(tags provider product_type answers orders)

  after_action :verify_authorized
  after_action :post_hook

  before_action :pre_hook
  before_action :load_product, only: [:show, :update, :destroy]
  before_action :load_products, only: [:index]

  has_scope :active, type: :boolean

  def_param_group :product do
    param :name, String, desc: 'Product Name', action_aware: true
    param :description, String, desc: 'Short description', action_aware: true
    param :active, :bool, desc: 'Product is active and available in the marketplace', action_aware: true
    param :setup_price, :decimal, precision: 10, scale: 4, desc: 'Initial Setup Fee', action_aware: true
    param :monthly_price, :decimal, precision: 10, scale: 4, desc: 'Cost per Month', action_aware: true
    param :hourly_price, :decimal, precision: 10, scale: 4, desc: 'Cost per Hour', action_aware: true
    param :product_type_id, :number, desc: 'Product Type', action_aware: true
    param :tags, Array, desc: 'List of tags', action_aware: true
    param_group :answers, ApplicationController
    error code: 422, desc: ParameterValidation::Messages.missing
  end

  api :GET, '/products', 'Returns a collection of products'
  param :page, :number
  param :per_page, :number
  param :active, :bool
  param :includes, Array, in: PRODUCT_INCLUDES

  def index
    authorize Product
    respond_with_params @products
  end

  api :GET, '/products/:id', 'Shows product with :id'
  param :id, :number, required: true
  param :includes, Array, in: PRODUCT_INCLUDES
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    authorize @product
    respond_with_params @product
  end

  api :POST, '/products', 'Creates product'
  param_group :product

  def create
    product = Product.new product_params
    authorize product
    product.save!
    respond_with product
  end

  api :PUT, '/products/:id', 'Updates product with :id'
  param_group :product
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def update
    authorize @product
    @product.update_attributes(product_params)
    respond_with @product
  end

  api :DELETE, '/products/:id', 'Deletes product with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    authorize @product
    @product.destroy
    respond_with @product
  end

  private

  def product_params
    params.permit(:name, :description, :img, :active, :hourly_price, :monthly_price, :setup_price,
      :provider_id, :product_type_id, tags: [], answers: [:id, :name, :value, :value_type]).tap do |p|
      p[:tag_list] = p.delete :tags
      p[:answers_attributes] = p.delete(:answers) || []
    end
  end

  def load_products
    @products ||= query_with apply_scopes(Product.all), :includes, :pagination, :tags_list
  end

  def load_product
    @product ||= Product.find params[:id]
  end
end
