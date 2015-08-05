# == Schema Information
#
# Table name: registered_providers
#
#  id              :integer          not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  deleted_at      :datetime
#  type            :string           not null
#  uuid            :string           not null
#  name            :string           not null
#  description     :text
#  cached_tag_list :string
#  provider_class  :string           not null
#  questions       :json
#
# Indexes
#
#  index_registered_providers_on_type  (type)
#  index_registered_providers_on_uuid  (uuid)
#

class RegisteredProvider < ActiveRecord::Base
  acts_as_paranoid
  acts_as_taggable

  has_many :providers

  def self.create(opts)
    registered_provider = RegisteredProvider.find_by uuid: opts[:uuid]
    registered_provider.nil? ? super(opts) : create_existing(registered_provider, opts)
  end

  def self.create!(opts)
    registered_provider = RegisteredProvider.find_by uuid: opts[:uuid]
    registered_provider.nil? ? super(opts) : create_existing(registered_provider, opts)
  end

  def self.policy_class
    RegisteredProviderPolicy
  end

  private

  def self.create_existing(registered_provider, opts)
    columns = %i(name description provider_class tag_list questions)
    to_update = Hash[opts.select { |k, _| columns.include? k }]
    registered_provider.update_attributes to_update
    registered_provider.update_column :type, opts[:type] if registered_provider.type != opts[:type]
    registered_provider
  end


  def self.load_registered_providers
    RegisteredProvider.table_exists?
  rescue
    false
  end

  def self.set(name, uuid, options)
    keys = %i(description provider_class tag_list questions)
    {
      name: name,
      uuid: uuid,
      description: '',
      provider_class: 'Provider',
      tag_list: [],
      questions: []
    }.merge options.keep_if { |key| keys.include? key }
  end
end
