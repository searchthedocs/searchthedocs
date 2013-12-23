// Query Model
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone');

  var QueryModel = Backbone.Model.extend({

    initialize: function(attributes, options) {
      var t = this;
      t.param_map = options.param_map;
    },

    to_query_string: function() {
      var t = this;
      var query_model_repr = {};
      _.each(t.toJSON(), function(v, k) {
        if (v) {
          query_model_repr[t.param_map[k]] = v;
        }
      });

      // Use jQuery to turn the object into a query string.
      return $.param(query_model_repr);
    }
  });

  return QueryModel;

});

