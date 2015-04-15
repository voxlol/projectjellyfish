# == Schema Information
#
# Table name: product_type_questions
#
#  id              :integer          not null, primary key
#  product_type_id :integer          not null
#  label           :text
#  field_type      :string(255)
#  placeholder     :string(255)
#  help            :text
#  options         :json
#  default         :text
#  required        :boolean          default(FALSE)
#  load_order      :integer
#  manageiq_key    :string(255)
#  created_at      :datetime
#  updated_at      :datetime
#

class ProductTypeQuestion < ActiveRecord::Base
end
