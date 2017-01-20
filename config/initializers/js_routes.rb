# -*- encoding : utf-8 -*-
Rails.application.reload_routes!
JsRoutes.generate!
SubdomainJsRoutes.generate!(file: File.join('app/assets/javascripts/subdomain_routes.js'), namespace: 'SubdomainRoutes')
