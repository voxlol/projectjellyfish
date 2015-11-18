require 'wisper'

Rails.application.configure do
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.delivery_method = :test if Rails.env.test?
end

Rails.application.config.to_prepare do
  Wisper.clear if Rails.env.development?
  Wisper::GlobalListeners.subscribe(SMTPListener.new)
end
