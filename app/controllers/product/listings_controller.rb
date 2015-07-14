class Product
  class ListingsController < ApplicationController
    after_action :verify_authorized

    api :GET, '/product_listings', 'Returns a collection of product listings'
    param :includes, Array, in: %w(product)
    param :page, :number
    param :per_page, :number

    def index
      authorize ::Product::Listing
      respond_with_params product_listings
    end

    def show
      respond_with product_listing
    end

    private

    def product_listings
      @product_listings ||= query_with product_scope, :includes, :pagination
    end

    def product_listing
      @product_listing ||= ::Product::Listing.find(params[:id]).tap { |pl| authorize pl }
    end

    def product_scope
      params[:product_type] ? ::Product::Listing.where(product_type: params[:product_type]) : ::Product::Listing.all
    end
  end
end
