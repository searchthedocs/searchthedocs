// SidebarView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars');

  var SidebarView = Backbone.View.extend({

    tagName: 'div',

    className: 'stfd-sidebar',

    render: function() {
      return this;
    }

  });

  return SidebarView;

});

