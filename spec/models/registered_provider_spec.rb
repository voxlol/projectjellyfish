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

require 'rails_helper'

RSpec.describe RegisteredProvider, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
