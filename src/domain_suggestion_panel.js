define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    domain_suggestion_panel_tmpl =
      require('text!./tmpl/domain_suggestion_panel.html');

  var DomainSuggestionPanel = Backbone.View.extend({

    tagName: 'p',

    className: 'domain-suggestions alert alert-info',

    template: Handlebars.compile(domain_suggestion_panel_tmpl),

    initialize: function(options) {
      var t = this;
      t.results_model = options.results_model;
      t.query_model = options.query_model;
    },

    render: function() {
      var t = this;
      var domains = t.results_model.get_domain_facets();
      if (domains && domains.length > 0) {
        t.$el.html(t.template({
          search: t.query_model.get('search'),
          domains: domains.slice(0,3)
        }));
      } else {
        t.$el.html('');
      }

      return this;
    }

  });

  return DomainSuggestionPanel;

});

