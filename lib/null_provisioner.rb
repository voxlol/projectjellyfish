class NullProvisioner
  def self.provision(*args)
    new(*args).provision
  end

  def self.retire(*args)
    new(*args).retire
  end

  def initialize(*); end

  def provision
    true
  end

  def retire
    true
  end
end
