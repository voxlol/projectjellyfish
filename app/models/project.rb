# == Schema Information
#
# Table name: projects
#
#  id            :integer          not null, primary key
#  name          :string(255)
#  description   :text
#  img           :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  deleted_at    :datetime
#  status        :integer          default(0)
#  archived      :datetime
#  spent         :decimal(12, 2)   default(0.0)
#  budget        :decimal(12, 2)   default(0.0)
#  start_date    :datetime
#  end_date      :datetime
#  health        :integer
#  monthly_spend :decimal(12, 2)   default(0.0)
#
# Indexes
#
#  index_projects_on_archived    (archived)
#  index_projects_on_deleted_at  (deleted_at)
#

class Project < ActiveRecord::Base
  # Includes
  acts_as_paranoid
  acts_as_taggable

  # Constants
  STATES = Hash[%w(unknown ok pending warning critical).map.with_index.to_a]

  # Relationships
  has_many :answers, as: :answerable
  has_many :memberships
  has_many :groups, through: :memberships
  has_many :staff, through: :groups
  has_many :alerts, as: :alertable
  has_many :latest_alerts, -> { latest }, class_name: 'Alert', as: :alertable
  has_many :approvals
  has_many :approvers, through: :approvals, source: :staff

  has_many :orders
  has_many :services, through: :orders

  accepts_nested_attributes_for :answers

  # Columns
  enum health: { pending: 0, ok: 1, warning: 2, critical: 3 }
  enum status: { undecided: 0, approved: 1, rejected: 2 }

  # Scopes
  scope :approved, -> { where(status: 1) }
  scope :archived, -> (archived = true) { archived ? where.not(archived: nil) : where(archived: nil) }

  def compute_current_status!
    if latest_service_alerts.any?
      update(health: highest_priority_latest_alert.status.downcase)
    else
      update(health: 'ok')
    end
  end

  def state
    1 == problem_count ? '1 Problem' : "#{problem_count} Problems"
  end

  def state_ok
    problem_count.zero?
  end

  def problem_count
    @problem_count ||= latest_service_alerts.count { |a| a unless a.status == 'ok' }
  end

  def latest_service_alerts
    services.map(&:latest_alerts).flatten
  end

  def highest_priority_latest_alert
    latest_service_alerts.max_by { |alert| STATES[alert.status.downcase] }
  end
end
