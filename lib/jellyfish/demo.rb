if Rails.env.development?
  Jellyfish::Extension.register :demo do
    name 'Demo Extension'
    author 'Project Jellyfish'
    description 'Demo Extension to show capabilities of the system without any external extension requirements'
    url 'http://projectjellyfish.org'
    version '0.0.1'
    path File.expand_path File.join('lib', 'jellyfish', 'demo.rb'), __FILE__

    requires_jellyfish '>= 3.5.0'

    register_product Null::Product
  end
end
