# == Schema Information
#
# Table name: projects
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :text
#  cc          :string(10)
#  staff_id    :string(255)
#  img         :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  deleted_at  :datetime
#  status      :integer          default(0)
#  approval    :integer          default(0)
#  archived    :datetime
#  spent       :decimal(12, 2)   default(0.0)
#  budget      :decimal(12, 2)   default(0.0)
#  start_date  :datetime
#  end_date    :datetime
#  health      :integer
#
# Indexes
#
#  index_projects_on_archived    (archived)
#  index_projects_on_deleted_at  (deleted_at)
#

class ProjectSerializer < ApplicationSerializer
  attributes :id, :name, :description, :cc, :staff_id, :img, :created_at, :updated_at, :deleted_at, :status, :health
  attributes :archived, :spent, :budget, :start_date, :end_date

  # Relationships
  has_many :project_questions
  has_many :project_answers
  has_many :groups
  has_many :alerts
  has_many :latest_alerts
  has_many :memberships
  has_many :approvals
  has_many :approvers, serializer: StaffSerializer
  has_many :services
  has_many :staff
  has_many :orders
  has_many :services

  def health
    object.pending? ? nil : object.health
  end
end
