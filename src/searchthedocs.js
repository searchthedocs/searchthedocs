// SearchTheDocsView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Navbar = require('./navbar'),
    Sidebar = require('./sidebar');

  var SearchTheDocsView = Backbone.View.extend({

    id: 'stfd',

    tagName: 'div',

    initialize: function(options) {
      var t = this;
      t.brand = options.brand;
      t.brand_href = options.brand_href;
    },

    render: function() {
      var t = this;

      // Render sidebar
      t.sidebar = new Sidebar();
      t.$el.append(t.sidebar.render().el);

      // Render navbar
      t.navbar = new Navbar({
        brand: t.brand,
        brand_href: t.brand_href
      });
      t.$el.append(t.navbar.render().el);


      return this;
    }

  });

  return SearchTheDocsView;

});

