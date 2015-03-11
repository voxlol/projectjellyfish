class ContentPageSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :slug
end
