// SearchTheDocsView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Navbar = require('./navbar'),
    Sidebar = require('./sidebar'),
    SearchFormView = require('./search_form'),
    ResultModel = require('./result_model'),
    configure_query_executor = require('./query_executor');

  var SearchTheDocsView = Backbone.View.extend({

    id: 'stfd',

    tagName: 'div',

    initialize: function(options) {
      var t = this;
      t.brand = options.brand;
      t.brand_href = options.brand_href;
      t.search_options = options.search_options;

      _.bindAll(t, 'send_query_to_executor', 'query_success', 'query_error');

      // Default endpoint
      t.ep_name = t.search_options.default_endpoint;

      t.set_endpoint(t.ep_name);
      // Create a model to represent the query params.
      t.query_model = new Backbone.Model();

      // Bind to change events on the model.
      t.listenTo(t.query_model, 'change', t.send_query_to_executor);

      // Create a search form view with the query model bound to it.
      t.search_form_view = new SearchFormView({
        query_model: t.query_model
      });

      t.results_model = new ResultModel(t.ep.result_format);

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

    send_query_to_executor: function() {
      var t = this;
      // Send the JSONified model to the query executor.
      var query_options = _.extend({}, t.query_model.toJSON());
      query_options.success = t.query_success;
      query_options.error = t.query_error;

      t.execute_query(query_options);
    },

    query_success: function(results) {
      console.log('success');
      console.log(this);
      this.results_model.set('results', results);
    },

    query_error: function() {
      console.log('error');
      console.log(this);
    },

    render: function() {
      var t = this;

      // Render sidebar
      t.sidebar = new Sidebar();
      t.$el.append(t.sidebar.render().el);

      // Render navbar
      t.navbar = new Navbar({
        brand: t.brand,
        brand_href: t.brand_href,
        search_form_view: t.search_form_view
      });
      t.$el.append(t.navbar.render().el);


      return this;
    }

  });

  return SearchTheDocsView;

});

