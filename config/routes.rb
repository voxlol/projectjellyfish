Rails.application.routes.draw do
  # Docs
  apipie

  scope '/api/v1', except: [:new, :edit], defaults: { format: :json } do
    # Auth
    devise_for :staff, controllers: { sessions: 'sessions' }

    devise_scope :staff do
      match '/staff/auth/:provider/callback', to: 'sessions#create', via: [:get, :post], defaults: { format: :html }
    end

    resources :saml, only: :index do
      collection do
        get :init
        get :sso
        post :acs
        get :metadata
        get :logout
      end
    end

    # Products & related
    resources :products
    resources :product_types, only: [:index, :show]
    resources :product_categories

    # Alerts Routes
    resources :alerts do
      collection do
        post :sensu
      end
    end

    resources :wizard_questions do
      collection do
        get :first
      end
    end

    # Approvals
    resources :staff, only: [:index, :show, :create, :update, :destroy] do
      collection do
        match 'current_member' => 'staff#current_member', via: :get
      end
    end

    # Organizations
    resources :organizations


    # Chargebacks
    resources :chargebacks

    resources :bundles

    # Project Routes
    resources :projects, only: [:index, :show, :create, :update, :destroy], defaults: { format: :json } do
      delete 'groups/:group_id' => 'memberships#destroy', as: :membership
      post 'groups' => 'memberships#create', as: :memberships
      put 'groups/:group_id' => 'memberships#update'

      get 'approvals' => 'project_approvals#index', as: :project_approvals
      post 'approve' => 'project_approvals#update', as: :approve_project
      delete 'reject' => 'project_approvals#destroy', as: :reject_project
    end

    # ProjectQuestion Routes
    resources :project_questions do
      collection { put :sort }
    end

    # Automate Routes
    resources :automate, only: [] do
      collection do
        get :catalog_item_initialization
        get :update_servicemix_and_chef
        get :provision_rds

        get :create_ec2
        get :create_rds
        get :create_s3
        get :create_ses
        get :create_vmware_vm
        get :create_chef_node

        get :retire_ec2
        get :retire_rds
        get :retire_s3
        get :retire_ses
        get :retire_vmware_vm
      end
    end

    # Content Pages Routes
    resources :content_pages, only: [:index, :create]
    resources :content_pages, only: [:update, :show, :destroy], param: :slug
    patch 'content_pages/revert/:slug', to: 'content_pages#revert'

    resources :groups
    post '/groups/:group_id/staff/:staff_id' => 'associations#create', as: :group_association
    delete '/groups/:group_id/staff/:staff_id' => 'associations#destroy'
    resources :roles, only: [:index, :show, :create, :update, :destroy]
    resources :tags, only: [:index]

    # MOTD Routes
    resource :motd, except: [:new, :edit]
  end

  root 'welcome#index'

  match '*path' => 'welcome#index', via: :all
end
