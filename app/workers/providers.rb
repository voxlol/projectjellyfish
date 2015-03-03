class Providers
  def aws_settings
    @aws_settings ||= Setting.find_by(hid: 'aws').settings_hash
  end

  def miq_settings
    @miq_settings ||= Setting.find_by(hid: 'manageiq').settings_hash
  end

  def miq_user
    @miq_user ||= Staff.find_by email: miq_settings[:email]
  end
end
