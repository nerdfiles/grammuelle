// Generated by CoffeeScript 1.11.1

/*
@fileOverview ./index.coffee
@description
Grammuelle.
 */

(function() {
  var Grammuelle, Operation, Parser, _, __fs__, __q__, capture_array, capture_module, g, log, open;

  __fs__ = require('fs');

  __q__ = require('promise-defer');

  log = console.log;

  _ = require('lodash');


  /*
  @name open
  @description
  Open a stylebook.
   */

  open = function(f) {
    var defer;
    if (f == null) {
      f = './__test__.scss';
    }
    defer = __q__();
    __fs__.readFile(f, 'utf-8', function(error, data) {
      defer.resolve(data);
    });
    return defer.promise;
  };


  /*
  @name capture_module
  @description
  Look for Do(...)
   */

  capture_module = function(view) {
    var m;
    if (m = view.match(/(\@include\s*(.*)\(\')(.*)(\')/)) {
      view = ("module[" + m.index + "]__") + m[3];
    }
    return view;
  };


  /*
  @name capture_array
  @description
  Look for Response((...))
   */

  capture_array = function(view) {
    var m, q;
    if (m = view.match(/(\@include\s*(.*)\(\()/)) {
      view = ("response[" + m.index + "]__") + m[2];
    }
    if (q = view.match(/^((.*)\-\-)(.*)/)) {
      view = ("mq[" + q.index + "]__") + _.trim(q[0]);
    }
    return view;
  };


  /*
  @class
  @name Parser
  @description
  Parser Contract Loader.
   */

  Parser = (function() {
    function Parser(parsers) {
      this.parsers = parsers;
    }

    Parser.prototype.contract = function(loaded, parser) {
      if (parser) {
        return parser(loaded || '');
      } else {
        return loaded;
      }
    };

    Parser.prototype.parse = function(content) {
      var c, list, view;
      c = content.split("\n");
      list = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = c.length; j < len; j++) {
          view = c[j];
          results.push(this.ready(view));
        }
        return results;
      }).call(this);
      log(list);
      return list;
    };

    Parser.prototype.ready = function(view) {
      var p;
      return p = this.parsers.reduce(this.contract, view);
    };

    return Parser;

  })();


  /*
  @class
  @name Operation
   */

  Operation = (function() {
    function Operation(op) {
      this.op = op;
      this.op;
    }

    return Operation;

  })();


  /*
  @class
  @name Grammuelle
   */

  Grammuelle = (function() {
    var p;

    p = new Parser([capture_module, capture_array]);

    function Grammuelle() {
      this.schema = null;
      this.done = null;
      open('./stylebook.grams').then(function(data) {
        return this.schema = data;
      });
    }

    Grammuelle.prototype.initialize = function() {
      return open().then(function(data) {
        var parseMap, psb;
        psb = p.parse(data);
        log(psb);
        parseMap = _.map(psb, function(d) {
          return new Operation(d);
        });
        return _.each(parseMap, function(q, i) {
          if (this.schema.match(/%%SCSS_NAME%%/)) {
            this.schema = this.schema.replace(/%%SCSS_NAME%%/g, q.op);
            return this.done = _.remove(parseMap, function(n) {
              return n === i;
            });
          } else {
            return this.schema = this.schema.replace(/%%SCSS_INNER%%/g, q.op);
          }
        });
      });
    };

    return Grammuelle;

  })();

  g = new Grammuelle;

  g.initialize();

}).call(this);
