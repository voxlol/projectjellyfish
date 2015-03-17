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

    provisionable factory: :manage_iq_product

    product_type { ProductType.names.first }
  end
end
