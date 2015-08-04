class Provider < ActiveRecord::Base
  acts_as_paranoid
  acts_as_taggable

  has_many :answers, as: :answerable
  belongs_to :registered_provider
end
