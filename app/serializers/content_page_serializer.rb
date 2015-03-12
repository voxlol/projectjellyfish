class ContentPageSerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :deleted_at, :staff_id, :slug, :title, :body
end
