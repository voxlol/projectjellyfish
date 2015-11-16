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

class LogSerializer < ApplicationSerializer
  attributes :id, :log_level, :message, :loggable_type, :loggable_id, :created_at, :updated_at
end
