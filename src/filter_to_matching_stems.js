define(function (require) {
  var _ = require('underscore');

  var filter_to_matching_stems = function(options) {
    var search = options.search;
    var array = options.array;
    return _.filter(array, function(s) {
      var stem = s.slice(0, search.length);
      return stem === search;
    });
   };

  return filter_to_matching_stems;

});

