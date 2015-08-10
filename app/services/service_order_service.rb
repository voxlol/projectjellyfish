class ServiceOrderService
  class Error < StandardError
  end

  class UnapprovedProject < Error
  end

  def initialize
  end

  def execute(current_user, order_params)
    project = Project.find order_params[:project_id]
    product = Product.find order_params[:product_id]
    product_type = product.product_type

    unless project.approved?
      fail UnapprovedProject, sprintf("Project '%s' has not been approved.", project.name)
    end

    service_params = order_params.delete :service
    service_class = product_type.service_class.constantize

    order = Order.new order_params
    order.staff = current_user
    order.setup_price = product.setup_price
    order.hourly_price = product.hourly_price
    order.monthly_price = product.monthly_price

    service.status = :pending
    service.status_msg = 'Provisioning service...'

    service = service_class.create service_params
    order.service = service
    order.save
    order
  end
end
