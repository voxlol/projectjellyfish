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

class Log < ActiveRecord::Base
  belongs_to :loggable, polymorphic: true

  enum log_level: { ok: 0, warning: 1, critical: 2 }
end
