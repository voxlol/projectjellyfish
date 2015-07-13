# == Schema Information
#
# Table name: settings
#
#  id         :integer          not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  type       :string
#  name       :string           not null
#  value      :text
#  value_type :integer          default(0)
#  default    :text
#
# Indexes
#
#  index_settings_on_type  (type)
#

class Setting < ActiveRecord::Base
  before_save :clear_value_when_default
  before_save :clear_cache
  after_find :readonly_if_overridden

  validates :name, presence: true, uniqueness: true
  validates :default, inclusion: { in: [true, false] }, if: -> (s) { s.value_type == :boolean }

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
    url: 11
  }

  class << self
    def [](name)
      name = name.to_s
      Setting.cache.fetch name do
        find_by(name: name).try :value
      end
    end

    def []=(name, value)
      name = name.to_s
      record = find_or_create_by name: name
      record.value = value
      record.save!
    end

    def create(opts)
      s = Setting.find_by name: opts[:name].to_s
      s.nil? ? super(opts.merge(value: SETTINGS[opts[:name].to_sym] || opts[:value])) : create_existing(s, opts)
    end

    def create!(opts)
      s = Setting.find_by name: opts[:name].to_s
      s.nil? ? super(opts.merge(value: SETTINGS[opts[:name].to_sym] || opts[:value])) : create_existing(s, opts)
    end

    def method_missing(method, *args)
      super(method, *args)
    rescue NoMethodError
      method_name = method.to_s

      if method_name =~ /=\Z/
        self[method_name.chomp '='] = args.first
      else
        self[method_name]
      end
    end

    private

    def create_existing(s, opts)
      bypass_readonly(s) do
        to_update = Hash[opts.select { |k, _| [:default].include? k }]
        to_update.merge!(value: SETTINGS[opts[:name].to_sym]) if SETTINGS.key?(opts[:name].to_sym)
        s.update_attributes to_update
        s.update_column :category, opts[:category] if s.category != opts[:category]
      end
      s
    end

    def cache
      Rails.cache
    end

    def bypass_readonly(s)
      s.instance_variable_set('@readonly', false) if (old_readonly = s.readonly?)
      yield s
    ensure
      s.readonly! if old_readonly
    end

    # Methods for loading default settings

    def load_defaults
      Setting.table_exists?
    end

    def set(name, description: '', default: nil, value: nil)
      { name: name, description: description, value: value, default: default }
    end
  end

  def value
    v = self[:value]
    v.nil? ? default : YAML.load(v)
  end

  def value=(v)
    v = v.to_yaml unless v.nil?
    self[:value] = v
  end

  alias_method :value_before_type_cast, :value

  def default
    d = self[:default]
    d.nil? ? nil : YAML.load(d)
  end

  def default=(v)
    self[:default] = v.to_yaml
  end

  alias_method :default_before_type_cast, :default

  def parse_string_value(val)
    begin
      self.value = Jellyfish::Cast::String.cast(val, value_type)
    rescue Jellyfish::Cast::FailedCastException => e
      invalid_value_error e.to_s
      return false
    rescue Jellyfish::Cast::UnhandledCastException
      raise StandardError, "parsing settings type '%s' from string is not defined".format(value_type)
    end
    true
  end

  private

  def clear_cache
    unless Setting.cache.delete(name.to_s)
      Rails.logger.warn "Failed to remove Setting['#{name}'] from cache"
    end
  end

  def readonly_if_overridden
    readonly! if !new_record? && SETTINGS.key?(name.to_sym)
  end

  def clear_value_when_default
    if self[:value] == self[:default]
      self[:value] = nil
    end
  end

  def invalid_value_error(error)
    errors.add :value, 'is invalid: %s'.format(error)
  end
end
