require 'wisper'

Wisper::GlobalListeners.subscribe(SMTPListener.new)
