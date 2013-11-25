// Doc Model
define(function (require) {
  var _ = require('underscore'),
    Backbone = require('backbone');

  var DocModel = Backbone.Model.extend({
    // Model to represent the current chosen document.
    // Constructs the url of the content using the content_url_format
    // from the endpoint config.

    initialize: function(attributes, options) {
      var t = this;
      t.content_url_template = Handlebars.compile(options.content_url_format);
    },

    get_content_url: function() {
      if (!_.isEmpty(this.attributes)) {
        return this.content_url_template(this.toJSON());
      }
    }

  });

  return DocModel;

});

