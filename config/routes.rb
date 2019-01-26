Rails.application.routes.draw do

  root :to => 'application#index'

  resources :saml, only: [:create]

  get 'logout' => 'application#logout'

  namespace :api do
    resources :go_links, only: [:index, :create, :update, :destroy]
  end

  get 'create' => 'application#index'
  get 'liveramp_health_check' => 'liveramp_health_checks/liveramp_health_checks#index'

  get '*path' => 'go_links_ui#show'

end
