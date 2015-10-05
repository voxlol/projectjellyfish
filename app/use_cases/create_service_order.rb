class CreateServiceOrder
  include UseCase
  include Pundit

  class UnapprovedProject < UseCase::Error
  end

  class UnnamedService < UseCase::Error
  end

  class MissingProject < UseCase::Error
  end

  class MissingProduct < UseCase::Error
  end

  class PersistError < UseCase::Error
  end

  attr_reader :order

  def initialize(current_user, order_params)
    @user = current_user
    @params = order_params
  end

  def perform
    validate
    build_service
    build_order
    authorize order, :create?
    save
    provision_service
  end

  private

  attr_reader :user, :params

  def validate
    unless project.approved?
      fail UnapprovedProject, "Project '#{project.name}' has not been approved."
    end

    unless params[:service]['name'].present?
      fail UnnamedService, 'A name for the service was not given.'
    end
  end

  def build_service
    service.type = service.class.to_s
    service.status = :pending
    service.status_msg = 'Provisioning service...'
  end

  def build_order
    order_params = params.merge(
      staff: user,
      setup_price: product.setup_price,
      hourly_price: product.hourly_price,
      monthly_price: product.monthly_price,
      service: service
    )

    @order = Order.new order_params
  end

  def save
    # Saving the service will also save the order
    unless service.save
      fail PersistError, 'The service could not be created.'
    end
  end

  def provision_service
    # TODO: Create a worker to handle provisioning the pending service
  end

  def project
    @project ||= Project.find params[:project_id]
  rescue ActiveRecord::RecordNotFound
    raise MissingProject, 'The associated project cannot be located.'
  end

  def product
    @product ||= Product.find params[:product_id]
  rescue ActiveRecord::RecordNotFound
    raise MissingProduct, 'The associated product cannot be located.'
  end

  def service_class
    @service_class ||= product.product_type.service_class
  end

  def service
    @service ||= service_class.new(params.delete :service)
  end

  def current_user
    @user
  end
end
