// SearchTheDocsView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Navbar = require('./navbar'),
    Sidebar = require('./sidebar'),
    configure_query_executor = require('./query_executor');

  var SearchTheDocsView = Backbone.View.extend({

    id: 'stfd',

    tagName: 'div',

    initialize: function(options) {
      var t = this;
      t.brand = options.brand;
      t.brand_href = options.brand_href;
      t.search_options = options.search_options;

      // Default endpoint
      t.ep_name = t.search_options.default_endpoint;
      t.set_endpoint(t.ep_name);

    },

    set_endpoint: function(ep_name) {
      var t = this;
      t.ep = t.search_options.endpoints[ep_name];

      // Configure query executor
      t.execute_query = configure_query_executor({
        api_url: t.ep.api_url,
        data_type: t.ep.data_type,
        param_map: t.ep.param_map,
        default_params: t.ep.default_params
      });
    },

    render: function() {
      var t = this;

      // Render sidebar
      t.sidebar = new Sidebar();
      t.$el.append(t.sidebar.render().el);

      // Render navbar
      t.navbar = new Navbar({
        brand: t.brand,
        brand_href: t.brand_href
      });
      t.$el.append(t.navbar.render().el);


      return this;
    }

  });

  return SearchTheDocsView;

});

