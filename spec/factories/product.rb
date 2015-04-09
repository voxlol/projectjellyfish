FactoryGirl.define do
  factory :product do
    active true
    img 'product.png'

    sequence :name do |n|
      "Product Name #{n}"
    end

    sequence :description do |n|
      "Product description #{n}"
    end

    product_type { ProductType.names.first }
  end
end
