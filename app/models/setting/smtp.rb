class Setting
  class SMTP < Setting
    def self.load_defaults
      return unless super
      transaction do
        [
          set('smtp_enabled', description: 'SMTP Enabled', value_type: :boolean, default: true),
          set('smtp_address', description: 'SMTP Server IP Address', value_type: :string, default: 'server'),
          set('smtp_port', description: 'SMTP Server Port', value_type: :integer, default: 587),
          set('smtp_user_name', description: 'SMTP User Name', value_type: :string, default: 'user'),
          set('smtp_password', description: 'SMTP Password', value_type: :password, default: 'password'),
          set('smtp_authentication', description: 'SMTP Authentication Method', value_type: :string, default: 'plain'),
          set('smtp_enable_starttls_auto', description: 'SMTP Start TLS Automatically', value_type: :boolean, default: true)
        ].each { |s| create! s.merge!(type: 'Setting::SMTP') }
      end
    end
  end
end
