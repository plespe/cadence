var __bind = function(fn, me){
  return function(){
    return fn.apply(me, arguments);
  };
};

var java = require('java');
var xml2js = require('xml2js');
var getParsedTree = require('./getParsedTree.js');

java.options.push('-Xmx4g');
java.classpath.push("stanford-corenlp-full-2014-01-04/ejml-0.23.jar");
java.classpath.push("stanford-corenlp-full-2014-01-04/joda-time.jar");
java.classpath.push("stanford-corenlp-full-2014-01-04/jollyday.jar");
java.classpath.push("stanford-corenlp-full-2014-01-04/xom.jar");
java.classpath.push("stanford-corenlp-full-2014-01-04/stanford-corenlp-3.3.1-models.jar");
java.classpath.push("stanford-corenlp-full-2014-01-04/stanford-corenlp-3.3.1.jar");


var StanfordSimpleNLP = function() {
  StanfordSimpleNLP.prototype.defaultOptions = {
    annotators: ['tokenize', 'ssplit', 'pos', 'parse']
  };
  function StanfordSimpleNLP(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    if ((callback != null) && typeof callback === 'function') {
      this.loadPipeline(options, callback);
    }
  }
  StanfordSimpleNLP.prototype.loadPipeline = function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = this.defaultOptions;
    } else if (!(options != null)) {
      options = this.defaultOptions;
    } else {
      if (!(options.annotators != null) || !Array.isArray(options.annotators)) {
        return callback(new Error('No annotators.'));
      }
    }
    return java.newInstance('java.util.Properties', __bind(function(err, properties) {
      return properties.setProperty('annotators', options.annotators.join(', '), __bind(function(err) {
        if (err != null) {
          return callback(err);
        }
        return java.newInstance('edu.stanford.nlp.pipeline.StanfordCoreNLP', properties, __bind(function(err, pipeline) {
          if (err != null) {
            return callback(err);
          }
          this.pipeline = pipeline;
          return callback(null);
        }, this));
      }, this));
    }, this));
  };

  StanfordSimpleNLP.prototype.loadPipelineSync = function(options) {
    var properties;
    if (!(options != null)) {
      options = this.defaultOptions;
    }
    properties = java.newInstanceSync('java.util.Properties');
    properties.setPropertySync('annotators', options.annotators.join(', '));
    return this.pipeline = java.newInstanceSync('edu.stanford.nlp.pipeline.StanfordCoreNLP', properties);
  };

  StanfordSimpleNLP.prototype.process = function(text, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {
        xml: {
          explicitRoot: false,
          explicitArray: false,
          attrkey: '$'
        }
      };
    }
    if (!(this.pipeline != null)) {
      return callback(new Error('Load a pipeline first.'));
    }
    return this.pipeline.process(text, __bind(function(err, annotation) {
      if (err != null) {
        return callback(err);
      }
      return java.newInstance('java.io.StringWriter', __bind(function(err, stringWriter) {
        if (err != null) {
          return callback(err);
        }
        return this.pipeline.xmlPrint(annotation, stringWriter, __bind(function(err) {
          if (err != null) {
            return callback(err);
          }
          return stringWriter.toString(__bind(function(err, xmlString) {
            if (err != null) {
              return callback(err);
            }
            return xml2js.parseString(xmlString, options.xml, __bind(function(err, result) {
              var sentence, sentences, _i, _len, _ref, _ref2, _ref3, _ref4, _ref5;
              if (err != null) {
                return callback(err);
              }
              try {
                sentences = result != null ? (_ref = result.document) != null ? (_ref2 = _ref.sentences) != null ? _ref2.sentence : void 0 : void 0 : void 0;
                if (typeof sentences === 'object' && Array.isArray(sentences)) {
                  _ref5 = result != null ? (_ref3 = result.document) != null ? (_ref4 = _ref3.sentences) != null ? _ref4.sentence : void 0 : void 0 : void 0;
                  for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
                    sentence = _ref5[_i];
                    sentence.parsedTree = getParsedTree(sentence != null ? sentence.parse : void 0);
                  }
                } else {
                  sentences.parsedTree = getParsedTree(sentences != null ? sentences.parse : void 0);
                }
              } catch (err) {
                return callback(err);
              }
              return callback(null, result);
            }, this));
          }, this));
        }, this));
      }, this));
    }, this));
  };
  return StanfordSimpleNLP;
}();
module.exports = StanfordSimpleNLP;