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
  include ValueTypes

  belongs_to :answerable, polymorphic: true

  validates :name, presence: true

  before_save :convert_value

  def value
    v = self[:value]
    v.nil? ? nil : YAML.load(v)
  end

  def value=(v)
    @uncast_value = v
    value_will_change! if v != value
  end

  alias_method :value_before_type_cast, :value

  private

  def parse_string_value(val)
    begin
      v = Jellyfish::Cast::String.cast(val, value_type)
      self[:value] = v.to_yaml
    rescue Jellyfish::Cast::FailedCastException => e
      invalid_value_error e.to_s
      return false
    rescue Jellyfish::Cast::UnhandledCastException
      raise StandardError, "parsing settings type '#{value_type}' from string is not defined"
    end
    true
  end

  # Convert/Cast the value to the proper type
  def convert_value
    # Do nothing if value has not changed
    return true unless value_changed?
    # Cast the value and return success
    return parse_string_value(@uncast_value) if @uncast_value.is_a? String
    # Convert the value to yaml otherwise
    v = @uncast_value.to_yaml unless @uncast_value.nil?
    self[:value] = v
  end

  def invalid_value_error(error)
    errors.add :value, "is invalid: #{error}"
  end
end
