// SearchFormView
define(function (require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var Handlebars = require('handlebars');
  var search_form_tmpl = require('text!./tmpl/search_form.html');
  var filter_to_matching_stems = require('./filter_to_matching_stems');
  var SuggestionsView = require('./suggestions');

  var SearchFormView = Backbone.View.extend({

    tagName: 'form',

    className: 'form-inline navbar-form navbar-left',

    template: Handlebars.compile(search_form_tmpl),

    events: {
      'input input': 'input_events',
      'keyup input': 'input_events',
      'keydown input': 'keydown_events'
    },

    input_events: function(e) {
      // Wrap events that should be called after a new input is received.
      var t = this;
      t.set_query(e);
    },

    keydown_events: function(e) {
      // Wrap events that should be called before a new input is received,
      // ie. to override the default key action.
      var t = this;


      // Ignore "return" keypresses, which would otherwise trigger a reload.
      if (e.keyCode == '13') {
        e.preventDefault();
        if (t.suggestions_view.current_selection) {
          t.suggestions_view.set_domain_val();
        }
        return;
      }

      if (e.keyCode == '40') {
        // Advance to next suggestion, if there are any suggestions currently.
        if (t.suggestions_model.get('suggestions')) {
          t.suggestions_view.next_suggestion();
          return;
        }
      }

      if (e.keyCode == '38') {
        // Move to previous suggestion, if there are any suggestions currently.
        if (t.suggestions_model.get('suggestions')) {
          t.suggestions_view.prev_suggestion();
          return;
        }
      }

      t.domain_match(e);
      t.unset_domain(e);
    },

    initialize: function(options) {
      var t = this;
      t.query_model = options.query_model;
      t.domain_list_model = options.domain_list_model;
      _.bindAll(t, 'input_events', 'keydown_events');
      t.listenTo(t.query_model, 'change:domain', t.render);

      t.suggestions_model = new Backbone.Model();
      t.suggestions_view = new SuggestionsView({
        query_model: t.query_model,
        suggestions_model: t.suggestions_model
      });
      t.listenTo(t.suggestions_view, 'suggestion_select', t.clear_suggestions);

    },

    clear_suggestions: function() {
      var t = this;
      t.in_completion = false;
      t.$('input').val('');
      t.suggestions_model.unset('suggestions');
    },

    render: function() {
      var t = this;
      t.$el.html(t.template(t.query_model.toJSON()));

      t.$el.append(t.suggestions_view.render().el);

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

           // Step 2: Set domain on query model if exact match.
           if (domains_matching_stem.length === 1) {
             t.query_model.set_domain(domains_matching_stem[0]);
             t.$('input').val('');
             t.suggestions_model.unset('suggestions');
             t.in_completion = false;
             return;
           } else {
             // Render a list of suggestions if multiple matches
             t.suggestions_model.set('suggestions', domains_matching_stem);
           }

           // Keep track of when we are in the middle of a completion.
           if (domains_matching_stem.length > 0) {
             t.in_completion = true;

             // Step 3: Find longest stem matching all filtered domains.
             var initial_stem_length = search_val.length + 1;
             var domain_match = domains_matching_stem[0];
             var max_stem_length = domain_match.length;
             var longest_matching_stem = search_val;
             for (var i = initial_stem_length; i <= max_stem_length; i++) {
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
             t.$('input').val(longest_matching_stem);
           }

         } else {
           // If tab is not pressed, remove suggestions.
           t.suggestions_model.unset('suggestions');
           // If we are in the middle of a completion, and space
           // is pressed...
           if (e.keyCode == '32' && t.in_completion) {
             // And the matches contain an exact match, finish the completion
             // with the search value.
             if (_.contains(domains_matching_stem, search_val)) {
               e.preventDefault();
               t.query_model.set_domain(search_val.trim());
               t.$('input').val('');
             }
           }
           t.in_completion = false;
         }
       }
    },

    unset_domain: function(e) {
      // If backspace is pressed, and there is no value
      // in the input, remove the domain.
      var t = this;
      var search_val = t.$('input').val();

      if (e.keyCode == '8' && search_val.length == 0) {
        e.preventDefault();
        t.query_model.unset('domain');
      }
    },

    set_query: function() {
       var t = this;
       var search_val = t.$('input').val();

       // Unset the search if:
       //  - there are more than 2 characters or there is a domain filter
       //  - and we are not in the middle of a completion.
       if (
         search_val && (
           search_val.length > 2
           || (t.query_model.get('domain')))
         && !t.in_completion
       ) {
         t.query_model.set('search', search_val);
       } else {
         t.query_model.set('search', undefined);
      }
    }

  });

  return SearchFormView;

});

