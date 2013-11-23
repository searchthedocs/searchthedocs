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

    render: function() {
      this.$el.html(this.template());
      return this;
    }

  });

  return SearchFormView;

});

