// SimpleListElementView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    simple_list_item = require('text!./tmpl/simple_list_item.html');

  var SimpleSearchListItemView = Backbone.View.extend({

    tagName: 'a',

    className: 'simple-list-item',

    template: Handlebars.compile(simple_list_item),

    events: {
      'click': 'set_document'
    },

    initialize: function(options) {
      var t = this;
      t.record = options.record;
      t.doc_model = options.doc_model;
      t.query_model = options.query_model;
    },

    set_document: function() {
      var t = this;
      // Remove active class from other doc links
      $('.simple-list-item').removeClass('active');
      // Add class to style selected doc link
      t.$el.addClass('active');

      // Set the document attributes, including the search term.
      var doc_obj = _.extend(
          {},
          t.record,
          {search: t.query_model.get('search')}
      );
      t.doc_model.set(doc_obj);
    },

    render: function() {
      var t = this;
      var context = {
        title: t.record.title
      }
      // Add domain to context if the current search is unscoped
      if (!t.query_model.get('domain')) {
        context['domain'] = t.record.domain;
      }
      t.$el.html(t.template(context));
      return t;
    }

  });

  return SimpleSearchListItemView;

});

