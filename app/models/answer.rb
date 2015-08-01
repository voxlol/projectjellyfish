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
#
# Indexes
#
#  index_answers_on_answerable_type_and_answerable_id  (answerable_type,answerable_id)
#

class Answer < ActiveRecord::Base
  belongs_to :answerable, polymorphic: true

  validates :name, presence: true
  validates :value, uri: true, if: -> (s) { s.value_type == 'url' }
  validates :value, email: true, if: -> (s) { s.value_type == 'email' }

  enum value_type: {
    string: 0,
    password: 1,
    integer: 2,
    boolean: 3,
    array: 4,
    json: 5,
    date: 6,
    datetime: 7,
    fingerprint: 8,
    certificate: 9,
    text: 10,
    url: 11,
    email: 12
  }
end
