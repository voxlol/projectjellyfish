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
#  options         :jsonb
#  deleted_at      :datetime
#  total           :float            default(0.0)
#
# Indexes
#
#  index_orders_on_deleted_at  (deleted_at)
#  index_orders_on_staff_id    (staff_id)
#

class Order < ActiveRecord::Base
  acts_as_paranoid
  acts_as_taggable

  belongs_to :staff
  has_many :order_items

  store_accessor :options

  accepts_nested_attributes_for :order_items

  def bundle_id=(bundle_id)
    order_items << Bundle.find(bundle_id).products.map do |product|
      OrderItem.new(product: product, project: project)
    end
  end

  def item_count
    order_items.count
  end

  def item_count_for_project_id(pid)
    order_items.where(project_id: pid).count
  end

  def total_per_order(oid)
    order_items.where(order_id: oid).map(&:calculate_price).sum
  end

  def exceeds_budget?
    grouped_order_items = order_items.group_by(&:project)
    grouped_order_items.reduce(false) do |over_budget, project_order_items|
      cost = project_order_items[1].map(&:calculate_price).sum
      over_budget || cost + project_order_items[0].spent.to_f > project_order_items[0].budget
    end
  end

  private

  def project
    order_items.any? ? order_items.first.project : nil
  end
end
