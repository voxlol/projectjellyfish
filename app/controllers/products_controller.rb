class ProductsController < ApplicationController
  after_action :verify_authorized
  after_action :post_hook

  before_action :pre_hook
  before_action :load_product, only: [:show, :update, :destroy]
  before_action :load_products, only: [:index]

  PRODUCT_METHODS = %w(product_type)
  PRODUCT_PRICE_REGEX = /\d{1,6}(\.\d{0,4})?/

  api :GET, '/products', 'Returns a collection of products'
  param :methods, Array, in: PRODUCT_METHODS
  param :page, :number
  param :per_page, :number
  param :active, :bool
  param :includes, Array, in: %w(chargebacks)

  def index
    authorize Product
    respond_with_params @products
  end

  api :GET, '/products/:id', 'Shows product with :id'
  param :id, :number, required: true
  param :includes, Array, in: %w(chargebacks)
  param :methods, Array, in: PRODUCT_METHODS
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    authorize @product
    respond_with_params @product
  end

  api :POST, '/products', 'Creates product'
  param :active, :bool, desc: 'Product is active and available in the marketplace'
  param :description, String, desc: 'Short description', required: true
  param :hourly_price, PRODUCT_PRICE_REGEX, desc: 'Cost per Hour'
  param :monthly_price, PRODUCT_PRICE_REGEX, desc: 'Cost per Month'
  param :name, String, desc: 'Product Name', required: true
  param :product_type, String, desc: 'Product Type', required: true
  param :provisioning_answers, Hash, desc: 'Provisioning Answers', required: true
  param :setup_price, PRODUCT_PRICE_REGEX, desc: 'Initial Setup Fee'
  param :tag_list, Array, desc: 'Array of Strings'
  error code: 422, desc: ParameterValidation::Messages.missing

  def create
    product = Product.new(product_params)

    required_attributes = Rails.application.config.x.product_types.to_a.assoc(product.product_type.name)[1]['required']

    unless required_attributes.blank?
      missing_parameters = required_attributes.select { |k| product_params['provisioning_answers'][k].blank? ? k : next }
    end

    fail ActionController::ParameterMissing, missing_parameters unless missing_parameters.blank?

    authorize product
    product.save!
    respond_with product
  end

  api :PUT, '/products/:id', 'Updates product with :id'
  param :methods, Array, in: PRODUCT_METHODS
  param :id, :number, required: true
  param :active, :bool, desc: 'Product is active and available in the marketplace'
  param :description, String, desc: 'Short description', required: true
  param :hourly_price, PRODUCT_PRICE_REGEX, desc: 'Cost per Hour'
  param :monthly_price, PRODUCT_PRICE_REGEX, desc: 'Cost per Month'
  param :name, String, desc: 'Product Name', required: true
  param :product_type, String, desc: 'Product Type', required: true
  param :provisioning_answers, Hash, desc: 'Provisioning Answers', required: true
  param :setup_price, PRODUCT_PRICE_REGEX, desc: 'Initial Setup Fee'
  param :tag_list, Array, desc: 'Array of Strings'
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  error code: 422, desc: ParameterValidation::Messages.missing

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
    params
      .permit(:name, :description, :img, :active, :hourly_price, :monthly_price, :setup_price, :product_type, :tag_list)
      .merge(params.slice(:provisioning_answers))
  end

  def load_product
    @product = (query_with Product.where(id: params.require(:id)), :includes).first || fail(ActiveRecord::RecordNotFound)
  end

  def load_products
    query = Product.all.tap { |q| q.where!(active: params[:active]) unless params[:active].nil? }
    @products = query_with query, :includes, :pagination, :tags_list
  end
end
