// LocalContentView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone');

  var LocalContentView = Backbone.View.extend({

    tagName: 'div',

    className: 'stfd-content-pane',


    initialize: function(options) {
      var t = this;
      _.bindAll(t, 'render', 'render_content');
      t.doc_model = options.doc_model;
      t.query_model = options.query_model;

      t.listenTo(t.doc_model, 'change', t.render);
    },

    render: function() {
      // If the doc model is populated, load the content from the API.
      if (!_.isEmpty(this.doc_model.toJSON())) {
        this.render_content();
      }
      return this;
    },

    render_content: function() {
      this.$el.html(this.doc_model.get('content'));
      Backbone.trigger('content_loaded', this.doc_model.toJSON());
    }

  });

  return LocalContentView;

});

