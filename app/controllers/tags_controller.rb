class TagsController < ApplicationController
  api :GET, '/tags', 'List tags with tagging_count'
  def index
    respond_with_params ActsAsTaggableOn::Tag.all
  end

  api :POST, '/products/:product_id/tags', 'Add tags to product'
  param :tag_list, Array, required: true, desc: 'Array of tag strings'
  param :product_id, :number, required: true, desc: 'Product id to tag'
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  def create
    product = Product.find(params[:product_id])
    product_type = Product.product_type.name.parameterize.underscore.downcase.to_sym
    product.set_tag_list_on(product_type, params[:tag_list])
    product.save!
    head :ok
  end

  api :DELETE, '/products/:product_id/tags', 'Remove tags tags from product'
  param :tag_list, Array, required: true, desc: 'Array of tag strings'
  param :product_id, :number, required: true, desc: 'Product id to tag'
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  def destroy
    product = Product.find(params[:product_id])
    product.tag_list.remove(params[:tag_list])
    product.save!
    head :ok
  end
end
