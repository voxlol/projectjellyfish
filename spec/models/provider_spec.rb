# == Schema Information
#
# Table name: providers
#
#  id                     :integer          not null, primary key
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  deleted_at             :datetime
#  type                   :string           not null
#  registered_provider_id :integer          not null
#  name                   :string           not null
#  description            :text
#  active                 :boolean
#  cached_tag_list        :string
#
# Indexes
#
#  index_providers_on_registered_provider_id  (registered_provider_id)
#  index_providers_on_type                    (type)
#

require 'rails_helper'

RSpec.describe Provider, type: :model do
  it 'assigns a type' do
    provider = create :provider, name: 'Demo', registered_provider_id: 3
    expect(provider.type).to eq('Provider::Type1')
  end

  it 'sets the registered_provider_id field'do
    provider = create :provider, name: 'Azure', type: 'Azure', registered_provider_id: 5
    expect(provider.registered_provider_id).to eq(5)
  end
end
