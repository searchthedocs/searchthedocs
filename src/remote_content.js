// RemoteContentView
// Fetches content from a remote url for display in the main
// frame.
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    LocalContentView = require('./local_content');

  var RemoteContentView = LocalContentView.extend({

    render: function() {
      // Override render to fetch content from remore resource
      // as specified by get_content_url().
      var t = this;
      // If the doc model is populated, fetch the HTML content.
      if (!_.isEmpty(t.doc_model.toJSON())) {
        $.ajax({
          type: 'GET',
          url: t.get_content_url(),
          data: {
            highlight: t.query_model.get('search')
          },
          success: t.render_content,
          error: t.error
        });
      }

      return t;
    },

    render_content: function(resp) {
      // Render content into pane.
      var $content = $(resp.responseText);
      // Attempt to find inner content for standard RTD layout.
      var $inner_content =
        $content.find('.rst-content')[0]
        // fallback to unfiltered content.
        || $content;
      this.$el.html($inner_content);
    },

    get_content_url: function() {
      var content_url = this.content_url_template(this.doc_model.toJSON());
      return content_url;
    },

    error: function() {
      console.log('error');
    }

  });

  return RemoteContentView;

});

