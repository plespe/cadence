var Sentences = Backbone.Model.extend({
  url: "/text",
  defaults: {
    text: "",
    parsedText: {}
  },
  initialize: function() {
    this.on('change:text', this.parseText, this);
  },

  parseText: function() {
    var context = this;
    $.ajax({
      type: 'POST',
      url: this.url,
      data: this.get('text'),
      success: function(result) {
        context.set({'parsedText': JSON.parse(result)});
        // console.log(context.get('parsedText'));
      },
      failure: function(err) {
        console.log(err);
      }
    });

  }
});


var FormView = Backbone.View.extend({

  events: {
    'submit': 'handleSubmit'
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var $text = this.$('#input');
    this.model.set({text: $text.val()});
  }
});


var SentencesView = Backbone.View.extend({
  initialize: function(){
    this.model.on('change:parsedText', this.render, this);
  },

 // template: _.template('<div class="text"><%- text %></div>'),

  render: function(){
    console.log('inside render');
    var sentences = this.model.get('parsedText').document.sentences.sentence;
    console.log(sentences);
    for (var i = 0; i < sentences.length; i++) {
      var $sentence = $('<div>' + sentences[i].parse + '</div>');
      console.log($sentence);
      $sentence.appendTo(this.$el);
    }
  }
});