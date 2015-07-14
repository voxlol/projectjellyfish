class Product
  class ListingSerializer < ApplicationSerializer
    attributes :id, :name, :description, :img, :active, :product
    attributes :setup_price, :hourly_price, :monthly_price
    attributes :created_at, :updated_at, :deleted_at
    attribute :tag_list, key: :tags

    def product
      ProductSerializer.new(object.product)
    end
  end
end
