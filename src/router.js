define(function (require) {
  var Backbone = require('backbone'),
    $ = require('jquery'),
    SearchTheDocsView = require('./searchthedocs');


  var SearchRouter = Backbone.Router.extend({
    // SearchRouter handles routing the user to the correct search view and
    // initial search parameters when loading from a bookmarked URL.
    // After the initial load, state and URL changes are handled
    // from within the search views.
    //
    // The options passed to this view are sent through to the search view
    // which matches the route, with the parameters appended.
    //
    // Expects a `container` parameter in the options to give the container
    // into which search views should be rendered.

    initialize: function(options) {
      this.options = options;
    },

    routes: {
      // Root will load the section search view.
      "":                   "route_to_section_search",
      "section*params":     "route_to_section_search"
    },

    route_to_section_search: function(params) {
      var t = this;
      // Add the query params from the route to the options.
      t.options['initial_params'] = params;
      // Initialize a new section search view.
      t.section_search = new SearchTheDocsView(t.options);
      // Render the section search view into the container given in options.
      $(t.options.container).html(t.section_search.render().el);
    }

  });

  return SearchRouter;

});

