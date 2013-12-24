// SearchTheDocsView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    NavbarView = require('./navbar'),
    Sidebar = require('./sidebar'),
    ResultsModel = require('./results_model'),
    DocModel = require('./doc_model'),
    QueryModel = require('./query_model'),
    configure_query_executor = require('./query_executor');

  var SearchTheDocsView = Backbone.View.extend({

    id: 'stfd',

    tagName: 'div',

    initialize: function(options) {
      var t = this;
      t.brand = options.brand;
      t.brand_href = options.brand_href;
      t.search_options = options.search_options;
      t.content_link_text = options.content_link_text;
      t.class_map = options.class_map;
      t.initial_params = options.initial_params;

      _.bindAll(t,
        'send_query_to_executor',
        'query_success',
        'query_error',
        'navigate_to_query'
      );

      // Set up default endpoint
      // TODO: Allow endpoint switching.
      t.ep_name = t.search_options.default_endpoint;
      t.set_endpoint(t.ep_name);

      // Create models

      // Create a model to represent the query params.
      t.query_model = new QueryModel({}, {
        param_map: t.ep.param_map
      });

      // Create a model to represent the list of domains and populate
      // asynchronously.
      t.domain_list_model = new Backbone.Model();
      t.populate_domain_list();

      // Create a model to represent the search results.
      t.results_model = new ResultsModel(t.ep.result_format);

      // Create a model to represent the currently chosen doc.
      t.doc_model = new DocModel(
        // initialize with empty attribues
        {},
        // initialize with content_url_format in options
        {content_url_format: t.ep.content_url_format}
      );

      // Set up model bindings

      // Create a debounced version of `send_query...`
      t.send_query_debounced = _.debounce(t.send_query_to_executor, 100);

      // Bind to change events on the model.
      t.listenTo(t.query_model, 'change', t.send_query_debounced);

      // Create a search form view with the query model bound to it.

      // Create a navbar, which contains the search form view.
      t.navbar = new NavbarView({
        brand: t.brand,
        brand_href: t.brand_href,
        content_link_text: t.content_link_text,
        doc_model: t.doc_model,
        query_model: t.query_model,
        domain_list_model: t.domain_list_model
      });

      // Create a sidebar to show the search results,
      // bound to the results model and the currently chosen doc model.
      t.sidebar = new Sidebar({
        results_model: t.results_model,
        doc_model: t.doc_model,
        query_model: t.query_model
      });

      // Create view to show the document content,
      // bound to the query model and the currently chosen doc model.
      // The content view class is configurable in the endpoint config.
      var ContentViewClass = t.class_map[t.ep.content_view_class_string];
      t.content_view = new ContentViewClass({
        doc_model: t.doc_model,
        query_model: t.query_model,
        content_url_format: t.ep.content_url_format
      });

      t.query_model.set({
        search: t.initial_params[t.ep.param_map.search],
        domain: t.initial_params[t.ep.param_map.domain]
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
      t.navigate_to_query();
      if (!_.isUndefined(t.query_model.get('search'))) {
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
    },

    visible: function() {
      // Function to be called once this view actually becomes visible in
      // the DOM.

      // Trigger 'view_loaded' event
      this.trigger('view_loaded');

      // Trigger `visible` event on navbar, so that the SearchFormView
      // can re-render itself based on container size for the initial render.
      this.navbar.trigger('visible');
    },

    populate_domain_list: function() {
      var t = this;
      $.ajax({
        dataType: 'json',
        url: t.ep.domain_list_url,
        success: function(data) {
          var domains = _.map(data.results, function(name) {
            return name.toLowerCase();
          });
          t.domain_list_model.set('domains', domains);
        }
      });
    },

    navigate_to_query: function() {
      // Change the url in response to query model changes.
      var t = this;

      // Hack to clear url before resetting query string.
      Backbone.history.navigate('', {replace: true});

      var qs = t.query_model.to_query_string();
      if (qs) {
        Backbone.history.navigate('section?' + t.query_model.to_query_string());
      } else {
        Backbone.history.navigate('section');
      }
    }

  });

  return SearchTheDocsView;

});

