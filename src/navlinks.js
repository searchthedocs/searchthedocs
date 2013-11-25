// Nav Links View
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    navlinks_tmpl = require('text!./tmpl/navlinks.html');

  var NavLinksView = Backbone.View.extend({

    tagName: 'span',

    template: Handlebars.compile(navlinks_tmpl),

    initialize: function(options) {
      var t = this;
      _.bindAll(t, 'render');
      t.brand = options.brand;
      t.brand_href = options.brand_href;
      t.content_link_text = options.content_link_text;
      t.search_form_view = options.search_form_view;
      t.doc_model = options.doc_model;

      t.listenTo(t.doc_model, 'change', t.render);
    },

    render: function() {
      var t = this;
      t.$el.html(t.template({
        brand: t.brand,
        brand_href: t.brand_href,
        content_url: t.doc_model.get_content_url(),
        content_link_text: t.content_link_text
      }));
      return t;
    }

  });

  return NavLinksView;

});

