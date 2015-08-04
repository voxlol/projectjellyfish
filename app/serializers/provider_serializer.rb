class ProviderSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :active, :type
  attribute :tag_list, key: :tags

  has_many :answers
  has_one :registered_provider

  def type
    object.type.split('::').last
  end
end
