class Setting < ActiveRecord::Base
  enum value_type: { string: 0, password: 1, integer: 2, boolean: 3, array: 4, hash: 5 }

  before_save :clear_value_when_default
  before_save :clear_cache
  after_find :readonly_if_overridden

  validates :name, :presence => true, :uniqueness => true
  validates :description, :presence => true
  validates :default, :inclusion => { :in => [true, false] }, :if => Proc.new { |s| s.value_type == 'boolean' }

  def self.[](name)
    name = name.to_s
    Setting.cache.fetch name do
      where(name: name).first.try :value
    end
  end

  def self.[]=(name, value)
    name = name.to_s
    record = find_or_create_by name: name
    record.value = value
    record.save!
  end

  def value
    v = read_attribute(:value)
    v.nil? ? default : YAML.load(v)
  end

  def value=(v)
    v = v.to_yaml unless v.nil?
    write_attribute :value, v
  end

  alias_method :value_before_type_cast, :value

  def default
    d = read_attribute(:default)
    d.nil? ? nil : YAML.load(d)
  end

  def default=(v)
    write_attribute :default, v.to_yaml
  end

  alias_method :default_before_type_cast, :default

  def self.create(opts)
    s = Setting.find_by_name(opts[:name].to_s)
    s.nil? ? super(opts.merge(:value => SETTINGS[opts[:name].to_sym] || opts[:value])) : create_existing(s, opts)
  end

  def self.create!(opts)
    s = Setting.find_by_name(opts[:name].to_s)
    s.nil? ? super(opts.merge(:value => SETTINGS[opts[:name].to_sym] || opts[:value])) : create_existing(s, opts)
  end

  def parse_string_value(val)
    case value_type
      when :boolean
        boolean = Jellyfish::Cast.to_bool(val)
        if boolean.nil?
          invalid_value_error 'must be boolean'
          return false
        end
        self.value = boolean
      when :integer
        if val =~ /\A\d+\Z/
          self.value = val.to_i
        else
          invalid_value_error 'must be integer'
          return false
        end
      when :array
        if val =~ /\A\[.*\]\Z/
          begin
            self.value = YAML.load(val.gsub(/(\,)(\S)/, "\\1 \\2"))
          rescue => e
            invalid_value_error e.to_s
            return false
          end
        else
          invalid_value_error 'must be an array'
          return false
        end
      when :string, :password, nil
        #string is taken as default setting type for parsing
        self.value = val.to_s.strip
      else
        raise StandardError.new("parsing settings type '%s' from string is not defined" % value_type)
    end
    true
  end

  def self.method_missing(method, *args)
    super(method, *args)
  rescue NoMethodError
    method_name = method.to_s

    #setter method
    if method_name =~ /=\Z/
      self[method_name.chomp("=")] = args.first
      #getter
    else
      self[method_name]
    end
  end

  private

  def self.create_existing(s, opts)
    bypass_readonly(s) do
      to_update = Hash[opts.select { |k, v| [:default].include? k }]
      to_update.merge!(:value => SETTINGS[opts[:name].to_sym]) if SETTINGS.key?(opts[:name].to_sym)
      s.update_attributes(to_update)
      s.update_column :category, opts[:category] if s.category != opts[:category]
    end
    s
  end

  def self.cache
    Rails.cache
  end

  def clear_cache
    unless Setting.cache.delete(name.to_s)
      Rails.logger.warn "Failed to remove Setting['#{name}'] from cache"
    end
  end

  def self.bypass_readonly(s, &block)
    s.instance_variable_set("@readonly", false) if (old_readonly = s.readonly?)
    yield(s)
  ensure
    s.readonly! if old_readonly
  end

  def readonly_if_overridden
    readonly! if !new_record? && SETTINGS.key?(name.to_sym)
  end

  def clear_value_when_default
    if read_attribute(:value) == read_attribute(:default)
      write_attribute(:value, nil)
    end
  end

  def invalid_value_error(error)
    errors.add(:value, 'is invalid: %s' % error)
  end

  # Methods for loading default settings

  def self.load_defaults
    # We may be executing something like rake db:migrate:reset, which destroys this table; only continue if the table exists
    Setting.first rescue return false
    # STI classes will load their own defaults
    true
  end

  def self.set(name, default, value = nil)
    name, category = name.split('/')[0..1].reverse
    { category: category, name: name, value: value, default: default }
  end
end
