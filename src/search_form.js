// SearchFormView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    search_form_tmpl = require('text!./tmpl/search_form.html');

  var SearchFormView = Backbone.View.extend({

    tagName: 'form',

    className: 'navbar-form navbar-left',

    template: Handlebars.compile(search_form_tmpl),

    events: {
      'change input': 'set_query',
      'keyup input': 'set_query',
      'input input': 'set_query',
      'keydown input': 'domain_match'
    },

    initialize: function(options) {
      var t = this;
      t.query_model = options.query_model;
      _.bindAll(t, 'set_query');
      t.listenTo(t.query_model, 'change:domain', t.render);
    },

    render: function() {
      var t = this;
      t.$el.html(t.template(t.query_model.toJSON()));


      // Determine size of domain bubble and adjust input width
      var bubble = t.$('.domain-bubble');
      if (bubble.length > 0) {
        var bubble_width = bubble.width();
        var input_width = t.$('.search-input-container').width();
        var new_input_width = input_width - bubble_width - 1;
        t.$('input').css({width: new_input_width});
      }

      return t;
    },

    domain_match: function(e) {
       // If tab is pressed, check for a domain match.
       var t = this;

       var search_val = t.$('input').val();
       if (e.keyCode == '9') {
         e.preventDefault();
         if (_.contains(['readthedocs', 'searchthedocs'], search_val)) {
           t.query_model.set('domain', search_val);
          t.$('input').val('');
         }
       }
    },

    set_query: function() {
       var t = this;
       var search_val = t.$('input').val();

       if (search_val.length > 2) {
         t.query_model.set('search', search_val);
       } else {
         // Unset the search if there are fewer than 3 characters.
         t.query_model.set('search', undefined);
      }
    }

  });

  return SearchFormView;

});

