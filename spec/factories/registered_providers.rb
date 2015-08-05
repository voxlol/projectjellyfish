# == Schema Information
#
# Table name: registered_providers
#
#  id              :integer          not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  deleted_at      :datetime
#  type            :string           not null
#  uuid            :string           not null
#  name            :string           not null
#  description     :text
#  cached_tag_list :string
#  provider_class  :string           not null
#  questions       :json
#
# Indexes
#
#  index_registered_providers_on_type  (type)
#  index_registered_providers_on_uuid  (uuid)
#

FactoryGirl.define do
  factory :registered_provider do
    
  end

end
