# == Schema Information
#
# Table name: answers
#
#  id              :integer          not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  answerable_id   :integer          not null
#  answerable_type :string           not null
#  name            :string           not null
#  value           :text
#  value_type      :integer
#  default         :text
#
# Indexes
#
#  index_answers_on_answerable_type_and_answerable_id  (answerable_type,answerable_id)
#

class Answer < ActiveRecord::Base
  belongs_to :answerable, polymorphic: true
end
