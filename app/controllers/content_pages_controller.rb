class ContentPagesController < ApplicationController
  after_action :verify_authorized

  before_action :load_content_page_slug, only: [:create]
  before_action :load_content_page, only: [:show, :update, :destroy]
  before_action :load_content_page_params, only: [:create, :update]
  before_action :load_content_pages, only: [:index]

  api :GET, '/content_pages', 'Returns a collection of content pages'
  param :page, :number, required: false
  param :per_page, :number, required: false

  def index
    authorize ContentPage
    respond_with_params @content_pages
  end

  api :GET, '/content_pages/:slug', 'Shows content page with :slug'
  param :slug, String, required: true
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def show
    authorize @content_page
    respond_with_params @content_page
  end

  api :POST, '/content_pages', 'Creates a content page'
  param :title, String, required: true, desc: 'The title of this content page.'
  param :body, String, required: false, desc: 'The body of this content page.'
  error code: 422, desc: ParameterValidation::Messages.missing

  def create
    @content_page = ContentPage.new @content_page_params
    authorize @content_page
    @content_page.slug = @slug
    @content_page.staff_id = current_user.id
    @content_page.save

    @content_revision_page = ContentPageRevision.new @content_page_params
    @content_revision_page.content_pages_id = @content_page.id
    @content_revision_page.save

    respond_with @content_page
  end

  api :PUT, '/content_pages/:slug', 'Updates content page with :slug'
  param :slug, String, required: true, desc: 'The slug of this content page.'
  param :title, String, required: true, desc: 'The updated title of this content page.'
  param :body, String, required: false, desc: 'The updated body of this content page.'
  error code: 404, desc: MissingRecordDetection::Messages.not_found
  error code: 422, desc: ParameterValidation::Messages.missing

  def update
    @content_page.update_attributes @content_page_params
    authorize @content_page
    @content_page.staff_id = current_user.id
    @content_page.save

    @content_revision_page = ContentPageRevision.new @content_page_params
    @content_revision_page.content_pages_id = @content_page.id
    @content_revision_page.staff_id = current_user.id
    @content_revision_page.save

    respond_with @content_page
  end

  api :DELETE, '/content_pages/:slug', 'Deletes content page with :slug'
  param :slug, String, required: true, desc: 'The slug of the content page to delete.'
  error code: 404, desc: MissingRecordDetection::Messages.not_found

  def destroy
    authorize @content_page
    @content_page.destroy
    respond_with @content_page
  end

  private

  def load_content_page_slug
    slug = params[:title].strip_tags.to_s.parameterize
    content_page_check = ContentPage.where('slug LIKE :slug', { slug: "#{slug}%" })
    @slug = content_page_check.count > 0 ? "#{slug}-#{content_page_check.count + 1}" : slug
  end

  def load_content_page_params
    @content_page_params = params.permit(:staff_id, :title, :body)
  end

  def load_content_page
    @content_page = ContentPage.find_by_slug(params.require(:slug))
  end

  def load_content_pages
    @content_pages = query_with ContentPage.all, :pagination
  end
end
