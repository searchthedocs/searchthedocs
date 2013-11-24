// ContentPaneView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone');

  var ContentPaneView = Backbone.View.extend({

    tagName: 'div',

    className: 'stfd-content-pane',


    initialize: function(options) {
      var t = this;
      _.bindAll(t, 'render', 'render_content');
      t.doc_model = options.doc_model;
      t.query_model = options.query_model;
      t.content_url_format = options.content_url_format;
      t.content_url_template = Handlebars.compile(t.content_url_format);

      t.listenTo(t.doc_model, 'change', t.render);
    },

    get_content_url: function() {
      var content_url = this.content_url_template(this.doc_model.toJSON());
      return content_url;
    },

    render: function() {
      var t = this;
      // If the doc model is populated, fetch the HTML content.
      if (!_.isEmpty(t.doc_model.toJSON())) {
        // Clear current content so user expects new content to load.
        t.$el.html('');
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
      console.log('success');
      // Render content into pane.
      var $content = $(resp.responseText);
      // Attempt to find inner content for standard RTD layout.
      var $inner_content =
        $content.find('.rst-content')[0]
        // fallback to unfiltered content.
        || $content;
      this.$el.html($inner_content);
    },

    error: function() {
      console.log('error');
    }

  });

  return ContentPaneView;

});

