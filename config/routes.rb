Rails.application.routes.draw do

  root :to => 'taxonomy_endpoint_ui#index'

  namespace :api do
    resources :taxonomy_endpoints, only: [:index, :show, :create, :update, :destroy]

    get 'protocol_struct', :to => 'thrift#fetch_struct'
  end

  get '*path', :to => 'taxonomy_endpoint_ui#index'
end
