[
  Jellyfish::Fog::AWS::DatabaseProductType,
  Jellyfish::Fog::AWS::StorageProductType,
  Jellyfish::Fog::AWS::InfrastructureProductType
].each do |type|
  Rails.configuration.x.product_types.merge!(type.as_json)
end
