// SidebarView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    SimpleSearchListItemView = require('./simple_search_list_item'),
    DomainSuggestionPanel = require('./domain_suggestion_panel');

  var SidebarView = Backbone.View.extend({

    tagName: 'div',

    className: 'stfd-sidebar',

    initialize: function(options) {
      var t = this;
      _.bindAll(t, 'render');
      t.results_model = options.results_model;
      t.doc_model = options.doc_model;
      t.query_model = options.query_model;

      t.listenTo(t.results_model, 'change', t.render);
    },

    render: function() {
      var t = this;
      // Clear existing items.
      t.$el.html('');


      t.suggestion_panel = new DomainSuggestionPanel({
        results_model: t.results_model,
        query_model: t.query_model
      });
      t.$el.append(t.suggestion_panel.render().el);

      var records = t.results_model.get_records();

      // Create a list item view for each record in the results.
      t.record_views = [];
      _.each(records, function(record) {
        var record_view = new SimpleSearchListItemView({
          record: record,
          doc_model: t.doc_model,
          query_model: t.query_model
        });
        t.record_views.push(record_view);
        t.$el.append(record_view.render().el);
      });

      // Set the current document to the first result, if any.
      if (t.record_views.length > 0) {
        t.record_views[0].set_document();
      } else {
        // Clear the document if no match in results.
        t.doc_model.clear();
      }

      return t;
    }

  });

  return SidebarView;

});

