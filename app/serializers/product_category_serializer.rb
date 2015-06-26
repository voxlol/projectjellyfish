# == Schema Information
#
# Table name: product_categories
#
#  id              :integer          not null, primary key
#  name            :string
#  description     :string
#  img             :string
#  cached_tag_list :string
#  deleted_at      :datetime
#  created_at      :datetime
#  updated_at      :datetime
#

class ProductCategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :img, :tag_list, :created_at, :updated_at, :deleted_at
end
