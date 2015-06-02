class ProductTypesController < ApplicationController
  api :GET, '/product_types', 'Returns a collection of product_types'

  def index
    respond_with_params ProductType.all.values
  end

  api :GET, '/product_types/:id', 'Shows product_type with :id'
  param :id, :number, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    product_type = ProductType.new(params[:id])
    respond_with_params product_type
  end

  api :GET, '/product_types/categories', 'Show all product categories.'
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def categories
    categories = []
    ActsAsTaggableOn::Tagging.where('context IS NOT NULL').select(:context).uniq.map(&:context).each do |context|
      ap context
      categories << { name: context, tags: Product.tags_on(context).select(:name).map(&:name) }
    end
    respond_with_params categories
  end
end
