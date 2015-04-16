class ServicePolicy < ApplicationPolicy
  def index?
    true
  end

  def count?
    true
  end

  def show?
    true
  end

  class Scope < Scope
    def resolve
      if user.admin?
        projects = Project.all
      else
        # Users are only allowed to see services from projects they are staff on
        projects = Project.joins(:staff_projects).where(staff_projects: { staff_id: user.id })
      end
      services = []
      projects.each do |project|
        OrderItem.where(project_id: project.id).each do |order_item|
          services << order_item
        end
      end
      services
    end
  end
end