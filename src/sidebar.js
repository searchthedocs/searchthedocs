// SidebarView
define(function (require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var Handlebars = require('handlebars');
  var SimpleSearchListItemView = require('./simple_search_list_item');
  var DomainSuggestionPanel = require('./domain_suggestion_panel');
  var sidebar_tmpl = require('text!./tmpl/sidebar.html');

  var SidebarView = Backbone.View.extend({

    tagName: 'div',

    className: 'stfd-sidebar',

    template: Handlebars.compile(sidebar_tmpl),

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

      // Render the container skeleton only once.
      if (!t.$el.html()) {
        t.$el.html(t.template());
      }

      t.suggestion_panel = new DomainSuggestionPanel({
        results_model: t.results_model,
        query_model: t.query_model
      });

      // Render the suggestions into their container.
      t.$('[data-view-name="suggestion-panel-container"]').html(
        t.suggestion_panel.render().el
      );

      // Remove any existing search items.
      t.$('[data-view-name="search-list-items"]').html('');

      // Create a list item view for each record in the results.
      var records = t.results_model.get_records();
      t.record_views = [];
      _.each(records, function(record) {
        var record_view = new SimpleSearchListItemView({
          record: record,
          doc_model: t.doc_model,
          query_model: t.query_model
        });
        t.record_views.push(record_view);
      // Append the search items into their container.
        t.$('[data-view-name="search-list-items"]').append(
          record_view.render().el
        );
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

