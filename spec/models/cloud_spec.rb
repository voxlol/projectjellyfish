# == Schema Information
#
# Table name: clouds
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text
#  created_at  :datetime
#  updated_at  :datetime
#  extra       :text
#  deleted_at  :datetime
#
# Indexes
#
#  index_clouds_on_deleted_at  (deleted_at)
#

describe Cloud do
  it { should have_many(:chargebacks) }
end
