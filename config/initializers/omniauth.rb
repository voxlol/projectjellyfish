Rails.application.config.middleware.use OmniAuth::Builder do
  # provider :developer unless Rails.env.production?
  # provider :dropbox, ENV['DROPBOX_ACCESS_KEY'], ENV['DROPBOX_SECRET_KEY'], path_prefix: '/staff/auth'
  # provider :ldap,
  #       host: ENV['LDAP_HOST'],
  #       base: ENV['LDAP_BASE'],
  #       uid: ENV['LDAP_UID'],
  #       port: ENV['LDAP_PORT'],
  #       method: ENV['LDAP_METHOD'],
  #       bind_dn: ENV['LDAP_BIND_DN'],
  #       password: ENV['LDAP_PASSWORD'],
  #       path_prefix: '/staff/auth'
end
