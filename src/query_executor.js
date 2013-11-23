// Query Executor
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery');

  var configure_query_executor = function(options){
    var api_url = options.api_url;
    var data_type = options.data_type;
    var param_map = options.param_map;
    var default_params = options.default_params;

    var execute_query = function(options) {
      var search = options.search;
      var domain = options.domain;
      var success = options.success;
      var error = options.error;

      // Create the initial data object by extending the default params
      var data = _.extend({}, default_params);

      // Add the search param, and optionally the domain param to data object.
      data[param_map['search']] = search;
      if (domain) {
        data[param_map['domain']] = domain;
      }

      $.ajax({
        dataType: data_type,
        url: api_url,
        data: data,
        success: success,
        error: error
      });

    };

    return execute_query;
  };

  return configure_query_executor;

});

