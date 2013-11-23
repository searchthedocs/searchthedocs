// SearchFormView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    navbar_tmpl = require('text!./tmpl/navbar.html');

  var Navbar = Backbone.View.extend({

    tagName: 'nav',

    className: 'navbar navbar-default',

    template: Handlebars.compile(navbar_tmpl),

    initialize: function(options) {
      var t = this;
      t.brand = options.brand;
      t.brand_href = options.brand_href;
      t.search_form_view = options.search_form_view;
    },

    render: function() {
      var t = this;
      t.$el.html(t.template({
        brand: t.brand,
        brand_href: t.brand_href
      }));

      // Render search form subview into container
      t.$('#search-form-container').html(t.search_form_view.render().el);
      return t;
    }

  });

  return Navbar;

});

