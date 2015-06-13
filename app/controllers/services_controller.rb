class ServicesController < ApplicationController
  ORDER_ITEM_INCLUDES = %w(product project order latest_alert)

  after_action :verify_authorized

  #before_action :load_order_item, only: [:show]

  api :GET, '/services', 'Returns a collection of services'
  param :includes, Array, in: ORDER_ITEM_INCLUDES

  def index
    authorize Service.new
    # TODO: These next two lines are a step in the right direction but it still needs clean up.
    load_projects
    @order_items = query_with OrderItem.where(project_id: @projects.pluck(:id)), :includes
    respond_with_params @order_items
  end

  api :GET, '/services/:id', 'Returns a service'
  param :id, :number, required: true
  param :includes, Array, in: ORDER_ITEM_INCLUDES
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    authorize order_item
    respond_with_params order_item
  end

  api :GET, '/services/all_count', 'Returns a count of services across all projects'

  def all_count
    authorize Service.new
    load_services_via_sql
    # BUILD COUNTS OF SERVICES ACROSS ALL PROJECTS
    overall_rollup = {}
    @services.each do |p|
      overall_rollup[p.service_name] = overall_rollup[p.service_name].nil? ? 1 : (overall_rollup[p.service_name] + 1)
    end
    # NORMALIZE COUNTS INTO DATA POINTS
    data_points = []
    overall_rollup.each do |k, v|
      data_point = {key: k, value: v}
      data_points << data_point
    end
    render json: data_points
  end

  api :GET, '/services/project_count', 'Returns a count of services grouped by project'

  def project_count
    authorize Service.new
    load_services_via_sql
    service_keys = {}
    all_projects = {}
    # BUILD COUNTS OF SERVICES PER PROJECT
    @services.each do |p|
      service_key = p.service_name
      project_key = p.project_name
      all_projects[project_key] = {x: project_key, y: 0} if all_projects[project_key].nil?
      service_keys[service_key] = {projects: {}} if service_keys[service_key].nil?
      service_keys[service_key][:projects][project_key] = 0 if service_keys[service_key][:projects][project_key].nil?
      service_keys[service_key][:projects][project_key] += 1
    end
    # NORMALIZE COUNTS INTO DATA POINTS
    data_points = []
    service_keys.each do |service_key, service_projects|
      data_point = {key: service_key, values: []}
      all_projects.each do |project_key, project_hash|
        value = project_hash.clone
        value[:y] = service_projects[:projects][project_key] unless service_projects[:projects][project_key].nil?
        data_point[:values] << value
      end
      data_points << data_point
    end
    render json: data_points
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

  api :GET, '/services/order_profiles', 'Lists project orders with start date and order item count'

  def order_profiles
    authorize Service.new
    load_project_orders_via_sql
    project_orders = {}
    @project_orders.each do |p|
      project_key = p.project_name
      project_orders[project_key] = {key: project_key, values: []} unless project_orders.key? project_key
      project_orders[project_key][:values] << [p.order_created_at.to_i, p.order_item_count]
    end
    render json: project_orders.values
  end

  private

  def order_item
    @_order_item ||= OrderItem.find params[:id]
  end

  def load_order_item
    @order_item = OrderItem.find params.require(:id)
  end

  def load_services_via_policy
    @services = policy_scope(Service)
  end

  def load_project_orders_via_sql
    # GET PROJECTS SCOPED TO USER
    load_projects
    # QUERY OUT DESIRED ATTRIBUTES - TODO: FIGURE OUT A BETTER WAY TO DO THIS
    @project_orders = @projects.joins(:services).joins('LEFT JOIN orders ON order_items.order_id = orders.id').select('
      projects.name as project_name,
      orders.id as id,
      MIN(orders.created_at) as order_created_at,
      COUNT(order_items.id) as order_item_count
    ').group('projects.name, orders.id')
  end

  def load_services_via_sql
    # GET PROJECTS SCOPED TO USER
    load_projects

    # CREATE PROJECT ID LIST
    @project_ids = []
    @projects.each do |project|
      @project_ids << project.id
    end

    # QUERY OUT DESIRED ATTRIBUTES - TODO: FIGURE OUT A BETTER WAY TO DO THIS
    @services = OrderItem.select(
      'order_items.*,
    projects.name as project_name,
    projects.description as project_description,
    products.name as service_name,
    products.description as service_description'
    ).from('order_items').where(project_id: @project_ids).joins(:project, :product)
  end

  def load_projects
    # GET PROJECTS SCOPED TO USER
    @projects = policy_scope(Project.all)
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
