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
      'input input': 'set_query'
    },

    initialize: function(options) {
      this.query_model = options.query_model;
      _.bindAll(this, 'set_query');
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    set_query: function() {
       var search_val = this.$('input').val();
       if (search_val.length > 2) {
         this.query_model.set('search', search_val);
       } else {
         // Unset the search if there are fewer than 3 characters.
         this.query_model.set('search', undefined);
      }
    }

  });

  return SearchFormView;

});

