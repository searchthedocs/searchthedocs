// SearchTheDocsView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Navbar = require('./navbar');

  var SearchTheDocsView = Backbone.View.extend({

    initialize: function(options) {
      var t = this;
      t.brand = options.brand;
      t.brand_href = options.brand_href;
      t.render();
    },

    render: function() {
      var t = this;
      t.navbar = new Navbar({
        brand: t.brand,
        brand_href: t.brand_href
      });
      t.$el.append(t.navbar.render().el);
    }

  });

  return SearchTheDocsView;

});

