class OrdersController < ApplicationController
  api :GET, '/orders', 'Returns all orders'
  param :includes, Array, in: Order.reflect_on_all_associations.map(&:name).map(&:to_s)
  error code: 422, desc: ParameterValidation::Messages.missing

  def index
    authorize Order
    respond_with_params orders
  end

  api :GET, '/orders/:id', 'Returns an order by :id'
  param :id, :number
  param :includes, Array, in: Order.reflect_on_all_associations.map(&:name).map(&:to_s)
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  error code: 422, desc: ParameterValidation::Messages.missing

  def show
    authorize order
    respond_with_params order
  end

  api :POST, '/orders', 'Make a new service order'
  param :project_id, :number, desc: 'Related project id', required: true
  param :product_id, :number, desc: 'Related product id', required: true
  param :service, Hash, required: true do
    param :name, String, desc: 'Name of the new service', required: true
  end
  param :answers, Array, desc: 'Provisioning Answers' do
    param :name, String, desc: 'Answer key'
    param :value_type, String, desc: 'How to interpret the :value'
  end
  error code: 400, desc: 'Order errors'
  error code: 422, desc: ParameterValidation::Messages.missing

  def create
    order = ServiceOrderService.new.execute(current_user, order_params)
    respond_with order
  rescue ServiceOrderService::Error => e
    fail_with error: e.message, type: e.class.to_s.split('::').last
  end

  private

  def order_params
    params.permit(:project_id, :product_id, service: [:name], answers: [:value, :value_type, :name]).tap do |o|
      o[:answers_attributes] = o.delete :answers
    end
  end

  def orders
    @_orders ||= query_with Order.all, :includes, :pagination
  end

  def order
    @_order ||= Order.find params[:id]
  end
end
