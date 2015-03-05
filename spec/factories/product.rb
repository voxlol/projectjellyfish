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

    product_type

    after :create do |product|
      product.product_type.questions.each do |question|
        create :product_answer, product: product, product_type_question_id: question.id
      end
    end
  end
end
