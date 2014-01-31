define(function(require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    suggestions_tmpl = require('text!./tmpl/suggestions.html');

  var SuggestionsView = Backbone.View.extend({

    events: {
      'mouseover .tt-suggestion': 'suggestion_mouseover',
      'mouseout .tt-suggestion': 'suggestion_mouseout',
      'click .tt-suggestion': 'suggestion_select',
    },

    template: Handlebars.compile(suggestions_tmpl),

    initialize: function(options) {
      var t = this;
      t.query_model = options.query_model;
      t.suggestions_model = options.suggestions_model;

      _.bindAll(t, 'render');

      t.listenTo(t.suggestions_model, 'change', t.render);
    },

    render: function() {
      var t = this;
      t.$el.html(t.template({
        suggestions: t.suggestions_model.get('suggestions')
      }));
      // Re-delegate events, otherwise, events will not be bound on re-render.
      t.delegateEvents();
      return t;
    },

    suggestion_mouseover: function(e) {
      $(e.currentTarget).addClass('tt-is-under-cursor');
      this.current_selection = $(e.currentTarget).data('domain');
    },

    suggestion_mouseout: function(e) {
      $(e.currentTarget).removeClass('tt-is-under-cursor');
    },

    suggestion_select: function(e) {
      var t = this;
      var domain_val = $(e.currentTarget).data('domain');
      t.current_selection = domain_val;
      t.set_domain_val();
    },

    set_domain_val: function() {
      var t = this;
      t.query_model.set_domain(t.current_selection);
      t.trigger('suggestion_select');
    },

    next_suggestion: function() {
      this.move_suggestion(1);
    },

    prev_suggestion: function() {
      this.move_suggestion(-1);
    },

    move_suggestion: function(step) {
      // Highlight the next/prev suggestion and set it to the current
      // selection.
      var t = this;
      var suggestions = t.suggestions_model.get('suggestions')
      if (!t.current_selection) {
        // Default to first
        t.current_selection = suggestions[0];
      } else {
         var index = _.indexOf(suggestions, t.current_selection);
         var new_index = index + step;

         // If we are looping around end, set index to 0.
         if (new_index >= suggestions.length) {
           t.current_selection = suggestions[0];

         // If we are looping around beginning, set index to last.
         } else if (new_index < 0) {
           t.current_selection = suggestions[suggestions.length - 1];

         // Else if we are not looping around, move to new index.
         } else {
           t.current_selection = suggestions[new_index];
         }
      }
      t.$('.tt-suggestion').removeClass('tt-is-under-cursor');
      t.$('[data-domain="' + t.current_selection + '"]')
        .addClass('tt-is-under-cursor');
      console.log(t.current_selection);
    },

  });

  return SuggestionsView;

});

