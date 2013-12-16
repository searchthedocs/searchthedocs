// NavbarView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    navbar_tmpl = require('text!./tmpl/navbar.html'),
    SearchFormView = require('./search_form'),
    NavLinksView = require('./navlinks');

  var NavbarView = Backbone.View.extend({

    tagName: 'nav',

    className: 'navbar navbar-default',

    template: Handlebars.compile(navbar_tmpl),

    initialize: function(options) {
      var t = this;
      _.bindAll(t, 'render');
      t.brand = options.brand;
      t.brand_href = options.brand_href;
      t.content_link_text = options.content_link_text;
      t.search_form_view = options.search_form_view;
      t.doc_model = options.doc_model;
      t.query_model = options.query_model;
      t.domain_list_model = options.domain_list_model;
    },

    render: function() {
      var t = this;
      // Template has no context.
      t.$el.html(t.template());

      // Render search form subview into container
      t.search_form_view = new SearchFormView({
        query_model: t.query_model,
        domain_list_model: t.domain_list_model
      });
      t.$('#search-form-container').html(t.search_form_view.render().el);

      // Trigger re-render of SearchFormView when it becomes visible,
      // to allow the view to adjust to its container size.
      t.on('visible', function() {
        t.search_form_view.render();
      });

      t.nav_links_view = new NavLinksView({
        brand: t.brand,
        brand_href: t.brand_href,
        content_link_text: t.content_link_text,
        doc_model: t.doc_model,
      });
      // Render nav links subview into container
      t.$('#nav-links-container').html(t.nav_links_view.render().el);
      return t;
    },

  });

  return NavbarView;

});

