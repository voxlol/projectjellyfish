# == Schema Information
#
# Table name: question_form_schemas
#
#  id              :integer          not null, primary key
#  created_at      :datetime
#  updated_at      :datetime
#  product_type_id :integer
#  schema          :json
#

class QuestionFormSchema < ActiveRecord::Base
end
