# == Schema Information
#
# Table name: logs
#
#  id            :integer          not null, primary key
#  log_level     :integer
#  message       :string
#  loggable_type :string
#  loggable_id   :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

require 'rails_helper'

RSpec.describe Log, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
