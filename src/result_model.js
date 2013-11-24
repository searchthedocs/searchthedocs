// Result Model
define(function (require) {
  var _ = require('underscore'),
    Backbone = require('backbone');

  var create_accessor = function(path_string) {
    // Create a list of accessor functions.
    var fn_list = _.map(path_string.split('.'), function(key) {
      return function(obj) {
        return obj[key];
      };
    });

    // Compose the accessor functions.
    return _.compose.apply(null, fn_list.reverse());
  };

  var ResultModel = Backbone.Model.extend({
    // This model contains just one, complex attribute: `results`.
    // The `results` attribute gets replaced every time an API call result
    // is received, and the model serves to notify listeners of changes
    // and provide simplified access to the records within the
    // API call result.

    initialize: function(options) {
      var t = this;
      t.records_path = options.records_path;
      t.record_format = options.record_format;

      // Create accessors.
      // Create records accessor.
      t.records_accessor = create_accessor(t.records_path)

      // Create a map of field accessors.
      t.field_accessors = {};
      _.each(t.record_format, function(path_string, key) {
        t.field_accessors[key] = create_accessor(path_string);
      });

    },

    get_records: function() {
      // Extract records from the raw result in a flattened format
      // specified by `record_format`.
      var t = this;
      // Extract the raw records hash.
      var raw_records = t.records_accessor(t.get('results'));

      // Build the records from the raw records.
      return _.map(raw_records, function(raw_record) {
        var record = {};
        // Apply each field accessor to the raw record.
        _.each(t.field_accessors, function(accessor, key) {
          record[key] = accessor(raw_record);
        });
        return record;
      });
    }

  });

  return ResultModel;

});
