// SidebarView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    SimpleSearchListItemView = require('./simple_search_list_item');

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

      var records = t.results_model.get_records();

      // Create a list item view for each record in the results.
      _.each(records, function(record) {
        var record_view = new SimpleSearchListItemView({
          record: record,
          doc_model: t.doc_model,
          query_model: t.query_model
        });
        t.$el.append(record_view.render().el);
      });

      // Set the current document to the first result, if any.
      if (records && records.length > 0) {
        var doc_obj = _.extend(
            {},
            records[0],
            {search: t.query_model.get('search')}
        );
        t.doc_model.set(doc_obj);
      } else {
        // Clear the document if no match in results.
        t.doc_model.clear();
      }

      return t;
    }

  });

  return SidebarView;

});

