module Jellyfish
  module Fog
    module AWS
      class Engine < ::Rails::Engine
        isolate_namespace Jellyfish::Fog::AWS
      end
    end
  end
end
