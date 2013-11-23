// SearchTheDocsView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    SearchFormView = require('./search_form');

  var SearchTheDocsView = Backbone.View.extend({

    initialize: function() {
       this.render();
    },

    render: function() {
      var t = this;
      t.search_form_view = new SearchFormView();
      t.$el.append(t.search_form_view.render().el);
    }

  });

  return SearchTheDocsView;

});

