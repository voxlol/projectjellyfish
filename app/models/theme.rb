# == Schema Information
#
# Table name: themes
#
#  id          :integer          not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  name        :string
#  description :text
#  config      :json             default([]), is an Array
#

class Theme < ActiveRecord::Base
  validates :name, presence: true
  validates :description, presence: true
  validate :valid_array_of_hashes?

  def valid_array_of_hashes?
    config.each(&:deep_symbolize_keys!)
    unless config.all? do |hash|
      hash.is_a?(Hash) && hash.key?(:type) && validate_hash(hash)
    end
      errors.add(:config, 'must be an array of hashes.')
    end
  end

  private

  def validate_hash(hash)
    if hash[:type] == 'group'
      return valid_group_hash hash
    elsif hash[:type] == 'style'
      return valid_style_hash hash
    else
      errors.add(:config, '"type" key must have either "group" or "style" as values.')
      return false
    end

    true
  end

  def valid_group_hash(hash)
    unless %i(name children).all? { |key| hash.key?(key) }
      errors.add(:config, 'group type hash must have "name" and "children" keys.')
      return false
    end

    hash[:children].all? { |child| validate_hash child }
  end

  def valid_style_hash(hash)
    unless %i(label selector rule value).all? { |key| hash.key?(key) }
      errors.add(:config, 'style type hash must have "label", "selector", "rule", and "value" keys.')
      return false
    end

    hash[:value] =~ /^#\h{6}/
  end
end
