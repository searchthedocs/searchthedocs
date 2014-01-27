define(function (require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');

  var VisEventsView = Backbone.View.extend({
    // A Backbone.View extension that allows a View to trigger events when
    // it's visibility changes. The view may also listen to its own visibility
    // events.

    setup_vis_events: function() {
      var t = this;
      _.bindAll(t, 'check_visibility');

      // Check if view element is visible when attributes of el change.
      t.visibility_observer = new MutationObserver(t.check_visibility);
      t.visibility_observer.observe(t.el, {attributes: true});

      // Check if view element is visible when DOM elements are
      // inserted or removed.
      t.insertion_observer = new MutationObserver(t.check_visibility);
      t.insertion_observer.observe(document, {childList: true, subtree: true});
    },

    check_visibility: function() {
      var t = this;
      var visible = t.$el.is(":visible");
      if (visible) {

        // If currently visible, and hidden as of last mutation,
        // fire `visible` event and set visibility to true.
        if (t.visibility !== true) {
          t.visibility = true;
          t.trigger('visible');
        }

      } else {
        // If currently not visible, and visible as of last mutation,
        // fire `hidden` event and set visibility to false.
        if (t.visibility !== false) {
          t.visibility = false;
          t.trigger('hidden');
        }
      }
     },

  });

  return VisEventsView;

});

