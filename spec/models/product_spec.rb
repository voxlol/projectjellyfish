# == Schema Information
#
# Table name: products
#
#  id                   :integer          not null, primary key
#  name                 :string(255)
#  description          :text
#  active               :boolean
#  img                  :string(255)
#  created_at           :datetime
#  updated_at           :datetime
#  deleted_at           :datetime
#  setup_price          :decimal(10, 4)   default(0.0)
#  hourly_price         :decimal(10, 4)   default(0.0)
#  monthly_price        :decimal(10, 4)   default(0.0)
#  provisioning_answers :jsonb
#  product_type         :string
#  cached_tag_list      :string
#
# Indexes
#
#  index_products_on_deleted_at       (deleted_at)
#  index_products_on_product_type_id  (product_type_id)
#

#

describe Product do
  it { should have_many(:chargebacks) }
  it 'should have an associated product_type' do
    product = Product.new(product_type: ProductType.names.first)
    expect(product.product_type).to eq ProductType.new(ProductType.names.first)
  end
end
