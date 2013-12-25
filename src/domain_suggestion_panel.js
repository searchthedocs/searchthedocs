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

    events: {
      'click [data-link-type="domain"]': 'set_domain',
      'click [data-link-type="more"]': 'render_more'
    },

    template: Handlebars.compile(domain_suggestion_panel_tmpl),

    initialize: function(options) {
      var t = this;
      t.results_model = options.results_model;
      t.query_model = options.query_model;

      _.bindAll(t, 'set_domain');
    },

    render: function(num_suggestions) {
      num_suggestions = num_suggestions || 3;
      var t = this;
      var domains = t.results_model.get_domain_facets();

      if (!t.query_model.get('domain') && domains && domains.length > 0) {
        var more = num_suggestions < domains.length;
        t.$el.html(t.template({
          search: t.query_model.get('search'),
          domains: domains.slice(0,num_suggestions),
          more: more
        }));
        t.$el.show();
      } else {
        t.$el.hide();
      }

      return this;
    },

    render_more: function() {
      this.render(10);
    },

    set_domain: function(e) {
      var domain = $(e.currentTarget).data('domain');
      this.query_model.set('domain', domain);
    }

  });

  return DomainSuggestionPanel;

});

