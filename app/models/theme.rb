# == Schema Information
#
# Table name: themes
#
#  id          :integer          not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  name        :string
#  description :text
#  config      :json
#

class Theme < ActiveRecord::Base
  CONFIG_SCHEMA = {
    'type': 'object',
    '$schema': 'http://json-schema.org/draft-04/schema',
    'properties': {
      'global': { 'type': 'array' },
      'link': { 'type': 'array' },
      'button': { 'type': 'array' },
      'navigation': { 'type': 'array' },
      'region': { 'type': 'array' },
      'tables': { 'type': 'array' },
      'tags': { 'type': 'array' },
      'modal': { 'type': 'array' }
    },
    'required': %w(global link button navigation region tables tags modal)
  }

  validates :name, presence: true
  validates :description, presence: true
  validates :config, presence: true, json: { schema: CONFIG_SCHEMA }

end
