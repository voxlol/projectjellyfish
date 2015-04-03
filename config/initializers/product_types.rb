require 'json'

Dir.glob(Rails.root.join('config', 'product_questions', '*.json')) do |filename|
  Rails.application.config.x.product_types.merge!(JSON.parse(File.read(filename)))
end
