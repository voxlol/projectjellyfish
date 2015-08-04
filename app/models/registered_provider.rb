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

class RegisteredProvider < ActiveRecord::Base
  acts_as_paranoid
  acts_as_taggable

  has_many :providers

  def self.load_registered_providers
    RegisteredProvider.table_exists?
  rescue
    false
  end

  def self.set(name, uuid, options)
    keys = %i(description tags questions)
    {
      name: name,
      uuid: uuid,
      description: '',
      tags: '',
      questions: {}
    }.merge options.keep_if do |key|
      keys.include? key
    end
  end
end
