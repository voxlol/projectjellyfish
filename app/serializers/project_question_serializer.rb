class ProjectQuestionSerializer < ActiveModel::Serializer
  attributes :id, :question, :help_text, :required
  attributes :created_at, :updated_at, :deleted_at, :position, :options, :field_type

  has_many :project_answers
end
