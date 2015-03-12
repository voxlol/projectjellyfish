# == Schema Information
#
# Table name: orders
#
#  id              :integer          not null, primary key
#  staff_id        :integer          not null
#  engine_response :text
#  active          :boolean
#  created_at      :datetime
#  updated_at      :datetime
#  options         :json
#  deleted_at      :datetime
#  total           :float            default(0.0)
#
# Indexes
#
#  index_orders_on_deleted_at  (deleted_at)
#  index_orders_on_staff_id    (staff_id)
#

describe Order do
  let(:options) { [{ dialog_name: 'name' }, { dialog_name: 'name2' }] }
  let(:staff) { create :staff }
  let(:product) { create :product }
  let(:project) { create :project }
  let(:order_item_model) { { product_id: product.id, project_id: project.id } }

  describe '#exceeds_budget?' do
    it 'returns true if the total is over the project budget' do
      order = setup_order(250)

      expect(order.exceeds_budget?).to be_truthy
    end

    it 'returns false if the total is under the project budget' do
      order = setup_order(100)

      expect(order.exceeds_budget?).to be_falsy
    end

    def setup_order(setup_price)
      project_one = create(:project, id: 1, budget: 200, spent: 0)
      project_two = create(:project, id: 2, budget: 100, spent: 0)
      order_items = [
        build(:order_item,
              project: project_one,
              setup_price: setup_price,
              hourly_price: 0,
              monthly_price: 0),
        build(:order_item,
              project: project_two,
              setup_price: setup_price,
              hourly_price: 0,
              monthly_price: 0)
      ]
      create(:order, order_items: order_items, staff_id: staff.id)
    end
  end

  it 'creates items w/ a product' do
    items = [order_item_model]
    order = Order.create(order_items_attributes: items, staff_id: staff.id)
    expect(order.order_items.count).to eq(1)
  end

  it 'creates an order with items' do
    order = Order.create(order_items_attributes: [order_item_model], staff_id: staff.id)
    expect(order.order_items.count).to eq(1)
  end

  it 'updates an order with items' do
    order = Order.create(order_items_attributes: [order_item_model], staff_id: staff.id)
    items = [{ id: order.order_items.first.id, setup_price: 12.34 }]

    order.update!(order_items_attributes: items)

    expect(order.order_items.count).to eq(1)
  end

  it 'can store unstructured options' do
    create :order, options: options
    order = Order.first

    expect(order.options[0][:dialog_name]).to eq(options[0]['dialog_name'])
    expect(order.options[1][:dialog_name]).to eq(options[1]['dialog_name'])
  end

  it "builds order_ids from a bundle's products" do
    products = create_pair(:product)
    bundle = create(:bundle, products: products)
    order = Order.new

    order.bundle_id = bundle.id

    expect(order.order_items.map(&:product_id).sort).to eq(bundle.product_ids.sort)
  end
end
