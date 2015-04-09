# == Schema Information
#
# Table name: product_answers
#
#  id                       :integer          not null, primary key
#  product_id               :integer          not null
#  product_type_question_id :integer          not null
#  answer                   :text
#  created_at               :datetime
#  updated_at               :datetime
#

class ProductAnswer < ActiveRecord::Base
end
