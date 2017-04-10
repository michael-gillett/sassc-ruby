Rails.application.routes.draw do

  root :to => 'go_links_ui#index'

  resources :saml, only: [:index, :create]
  get 'logout' => 'application#logout'

  namespace :api do
    resources :go_links, only: [:index, :create, :update, :destroy]
  end

  get '*path', :to => 'go_links_ui#index'

end
