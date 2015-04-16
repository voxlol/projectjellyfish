class ServicesController < ApplicationController
  after_action :verify_authorized

  api :GET, '/services', 'Returns a collection of services'
  def index
    authorize Service.new
    load_services_via_sql
    render json: @services, each_serializer: ServiceSerializer
  end

  api :GET, '/services/count', 'Returns a count of independent services across projects'
  def count
    authorize Service.new
    load_services_via_sql
    service_rollup = {}
    overall_rollup = {}
    @services.each do |p|
      service_rollup[p.project_name] = {} if service_rollup[p.project_name].nil?
      service_rollup[p.project_name][p.service_name] = service_rollup[p.project_name][p.service_name].nil? ? 1 : (service_rollup[p.project_name][p.service_name] + 1)
      overall_rollup[p.service_name] = overall_rollup[p.service_name].nil? ? 1 : (overall_rollup[p.service_name] + 1)
    end
    service_rollup[:ALL] = overall_rollup
    render json: service_rollup
  end

  api :GET, '/services/:tag', 'Returns services with :tag'
  def show
    authorize Service.new
    load_tagged_services
    render json: @services, each_serializer: ServiceSerializer
  end

  private

  def load_services_via_policy
    @services = policy_scope(Service)
  end

  def load_services_via_sql
    # GET PROJECTS SCOPED TO USER AND GET TAGGED ORDER ITEMS (SERVICES)
    projects = policy_scope(Project.all)

    # CREATE PROJECT ID LIST
    project_ids = []
    projects.each do |project|
      project_ids << project.id
    end

    # QUERY OUT DESIRED ATTRIBUTES - TODO: FIGURE OUT A BETTER WAY TO DO THIS
    @services = OrderItem.select(
      'order_items.*,
  projects.name as project_name,
  projects.description as project_description,
  products.name as service_name,
  products.description as service_description'
    ).from('order_items').where(project_id: project_ids).joins(:project, :product)
  end

  def load_tagged_services
    # GET PROJECTS SCOPED TO USER AND GET TAGGED ORDER ITEMS (SERVICES)
    projects = policy_scope(Project)

    # CREATE PROJECT ID LIST
    project_ids = []
    projects.each do |project|
      project_ids << project.id
    end

    # QUERY OUT DESIRED ATTRIBUTES - TODO: FIGURE OUT A BETTER WAY TO DO THIS
    @services = OrderItem.tagged_with(params[:tag]).select(
      'order_items.*,
    projects.name as project_name,
    projects.description as project_description,
    products.name as service_name,
    products.description as service_description'
    ).from('order_items').where(project_id: project_ids).joins(:project, :product)
  end
end
