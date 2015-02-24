class BundlesController < ApplicationController
  def create
    @_bundle = Bundle.new
    update
  end

  def update
    bundle.assign_attributes(bundle_params)
    bundle.save!
    respond_with bundle
  end

  private

  def bundle
    @_bundle ||= Bundle.find(params[:id])
  end

  def bundle_params
    params.permit(:name, :description, :img, :active, :deleted)
  end
end
