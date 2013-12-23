// SearchFormView
define(function (require) {
  var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    Handlebars = require('handlebars'),
    search_form_tmpl = require('text!./tmpl/search_form.html'),
    filter_to_matching_stems = require('./filter_to_matching_stems'),
    SuggestionsView = require('./suggestions');

  var SearchFormView = Backbone.View.extend({

    tagName: 'form',

    className: 'navbar-form navbar-left',

    template: Handlebars.compile(search_form_tmpl),

    events: {
      'change input': 'set_query',
      'keyup input': 'set_query',
      'input input': 'set_query',
      'keydown input': 'domain_match'
    },

    initialize: function(options) {
      var t = this;
      t.query_model = options.query_model;
      t.domain_list_model = options.domain_list_model;
      _.bindAll(t, 'set_query');
      t.listenTo(t.query_model, 'change:domain', t.render);

      t.suggestions_model = new Backbone.Model();
      t.suggestions_view = new SuggestionsView({
        suggestions_model: t.suggestions_model
      });
    },

    render: function() {
      var t = this;
      t.$el.html(t.template(t.query_model.toJSON()));

      t.$el.append(t.suggestions_view.render().el);


      // Determine size of domain bubble and adjust input width
      var bubble = t.$('.domain-bubble');
      if (bubble.length > 0) {
        var bubble_width = bubble.outerWidth();
        t.$('input').css('padding-left', bubble_width + 6);
      }

      return t;
    },

    domain_match: function(e) {
       // If tab is pressed, check for a domain match.
       var t = this;

       var search_val = t.$('input').val();

       // If we don't already have a domain filter, try to complete one.
       if (!t.query_model.get('domain')) {

         // Step 1: Filter to domains with stems matching the search string.
         var domains_matching_stem = filter_to_matching_stems({
           search: search_val,
           array: t.domain_list_model.get('domains')
          });

         if (e.keyCode == '9') {
           e.preventDefault();

           // Step 2: Set domain on query model if exact match
           // and if this is the second time the user hits tab after
           // a completion.
           if (t.in_completion) {
             if (domains_matching_stem.length === 1) {
               t.query_model.set('domain', search_val);
               t.$('input').val('');
               t.suggestions_model.unset('suggestions');
               return;
             } else {
               // Render a list of suggestions if multiple matches
               t.suggestions_model.set('suggestions', domains_matching_stem);
             }
           }

           // Keep track of when we are in the middle of a completion.
           if (domains_matching_stem.length > 0) {
             t.in_completion = true;

             // Step 3: Find longest stem matching all filtered domains.
             var initial_stem_length = search_val.length + 1;
             var domain_match = domains_matching_stem[0];
             var max_stem_length = domain_match.length;
             var longest_matching_stem = search_val;
             console.log(domains_matching_stem);
             for (var i = initial_stem_length; i < max_stem_length; i++) {
               var new_stem = domain_match.slice(0, i);
               var all_matching = _.all(domains_matching_stem, function(domain) {
                 return new_stem === domain.slice(0, i);
               });
               if (!all_matching) {
                 break;
               } else {
                 longest_matching_stem = new_stem;
               }
             }
             console.log(longest_matching_stem);
             t.$('input').val(longest_matching_stem);
           }

         } else {
           // If tab is not pressed, remove suggestions.
           t.suggestions_model.unset('suggestions');
           // If we are in the middle of a completion, and space
           // is pressed...
           if (t.in_completion && e.keyCode == '32') {
             console.log('in completion, space pressed');
             // And the matches contain an exact match, finish the completion
             // with the search value.
             if (_.contains(domains_matching_stem, search_val)) {
               e.preventDefault();
               t.query_model.set('domain', search_val.trim());
               t.$('input').val('');
               return;
             }
           }
           t.in_completion = false;
         }
       }
    },

    set_query: function() {
       var t = this;
       var search_val = t.$('input').val();

       if (search_val.length > 2 && !t.in_completion) {
         t.query_model.set('search', search_val);
       } else {
         // Unset the search if there are fewer than 3 characters
         // or if we are in the middle of a completion.
         t.query_model.set('search', undefined);
      }
    }

  });

  return SearchFormView;

});

