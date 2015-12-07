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
  validates :name, presence: true
  validates :description, presence: true
  validate :colors_are_hex_format, if: :config

  def colors_are_hex_format
    unless config.values.all? { |color| color =~ /^#\h{6}/ }
      errors.add(:config, 'must be in hex format.')
    end
  end
end
