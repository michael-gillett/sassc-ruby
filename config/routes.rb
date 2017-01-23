Rails.application.routes.draw do

  root :to => 'go_links_ui#index'

  namespace :api do
    resources :go_links, only: [:index, :show, :create, :update, :destroy]
  end

  get '*path', :to => 'go_links_ui#index'
end
