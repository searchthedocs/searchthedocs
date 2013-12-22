define(function(require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    suggestions_tmpl = require('text!./tmpl/suggestions.html');

  var SuggestionsView = Backbone.View.extend({

    template: Handlebars.compile(suggestions_tmpl),

    initialize: function(options) {
      var t = this;
      t.suggestions_model = options.suggestions_model;

      _.bindAll(t, 'render');

      t.listenTo(t.suggestions_model, 'change', t.render);
    },

    render: function() {
      var t = this;
      t.$el.html(t.template({
        suggestions: t.suggestions_model.get('suggestions')
      }));
      return t;
    }
  });

  return SuggestionsView;

});

