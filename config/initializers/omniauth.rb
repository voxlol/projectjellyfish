Rails.application.config.middleware.use OmniAuth::Builder do
  provider :developer unless Rails.env.production?
  provider :dropbox, '70a8dlmud44qtv3', 'kclm0ns8r7w2ep6', path_prefix: '/staff/auth'
end
