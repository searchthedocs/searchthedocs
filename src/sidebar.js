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

      _.each(t.results_model.get_records(), function(record) {
        var record_view = new SimpleSearchListItemView({
          record: record,
          doc_model: t.doc_model,
          query_model: t.query_model
        });
        t.$el.append(record_view.render().el);
      });
      return t;
    }

  });

  return SidebarView;

});

