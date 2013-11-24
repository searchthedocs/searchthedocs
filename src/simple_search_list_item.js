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
    },

    set_document: function() {
      this.doc_model.set(this.record);
    },

    render: function() {
      var t = this;
      t.$el.html(t.template(t.record));
      return t;
    }

  });

  return SimpleSearchListItemView;

});

