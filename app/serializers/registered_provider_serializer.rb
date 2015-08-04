# == Schema Information
#
# Table name: registered_providers
#
#  id              :integer          not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  uuid            :string           not null
#  name            :string           not null
#  description     :text
#  cached_tag_list :string
#  provider_type   :string           not null
#  questions       :json
#
# Indexes
#
#  index_registered_providers_on_uuid  (uuid)
#

class RegisteredProviderSerializer < ActiveModel::Serializer
  attributes :id, :uuid, :name, :description, :questions
  attribute :tag_list, key: :tags
end
