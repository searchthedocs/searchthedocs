// SearchTheDocsView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Navbar = require('./navbar'),
    Sidebar = require('./sidebar'),
    SearchFormView = require('./search_form'),
    ResultsModel = require('./results_model'),
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

      // Set up default endpoint
      t.ep_name = t.search_options.default_endpoint;
      t.set_endpoint(t.ep_name);


      // Create models

      // Create a model to represent the query params.
      t.query_model = new Backbone.Model();


      // Create a model to represent the search results.
      t.results_model = new ResultsModel(t.ep.result_format);

      // Create a model to represent the currently chosen doc.
      t.doc_model = new Backbone.Model();



      // Set up model bindings

      // Create a debounced version of `send_query...`
      t.send_query_debounced = _.debounce(t.send_query_to_executor, 100);

      // Bind to change events on the model.
      t.listenTo(t.query_model, 'change', t.send_query_debounced);

      // Create a search form view with the query model bound to it.
      t.search_form_view = new SearchFormView({
        query_model: t.query_model
      });

      // Create a navbar, which contains the search form view.
      t.navbar = new Navbar({
        brand: t.brand,
        brand_href: t.brand_href,
        search_form_view: t.search_form_view
      });

      // Create a sidebar to show the search results,
      // bound to the results model and the currently chosen doc model.
      t.sidebar = new Sidebar({
        results_model: t.results_model,
        doc_model: t.doc_model
      });

      // Create view to show the document content,
      // bound to the query model and the currently chosen doc model.
      // The content view class is configurable in the endpoint config.
      t.content_view = new t.ep.ContentViewClass({
        doc_model: t.doc_model,
        query_model: t.query_model,
        content_url_format: t.ep.content_url_format
      });

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
      // Only send query if search is not undefined.
      if (t.query_model.get('search')) {
        // Send the JSONified model to the query executor.
        var query_options = _.extend({}, t.query_model.toJSON());
        query_options.success = t.query_success;
        query_options.error = t.query_error;

        t.most_recent_xhr = t.execute_query(query_options);
      } else {
        // Unset results if no query was sent.
        this.results_model.set('results', undefined);
      }
    },

    query_success: function(results) {
      this.results_model.set('results', results);
    },

    query_error: function() {
      console.log('error');
    },

    render: function() {
      var t = this;

      // Render sidebar
      t.$el.append(t.sidebar.render().el);

      // Render navbar
      t.$el.append(t.navbar.render().el);

      // Render content pane
      t.$el.append(t.content_view.render().el);

      return this;
    }

  });

  return SearchTheDocsView;

});

