module ValueTypes
  extend ActiveSupport::Concern

  included do
    validates :value, uri: true, if: -> (s) { s.value_type == 'url' }
    validates :value, email: true, if: -> (s) { s.value_type == 'email' }
    # TODO: Add more type validations

    enum value_type: {
      string: 0,
      password: 1,
      integer: 2,
      boolean: 3,
      array: 4,
      json: 5,
      date: 6,
      datetime: 7,
      fingerprint: 8,
      certificate: 9,
      text: 10,
      url: 11,
      email: 12
    }
  end
end
