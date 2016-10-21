###
@fileOverview ./index.coffee
@description
Grammuelle.
###

__fs__ = require('fs')
__q__ = require('promise-defer')
log = console.log
_ = require('lodash')


###
@name open
@description
Open a stylebook.
###

open = (f = './__test__.scss') ->
  defer = __q__()
  __fs__.readFile(f, 'utf-8', (error, data) ->
    defer.resolve data
    return
  )
  defer.promise

###
@name capture_module
@description
Look for Do(...)
###

capture_module = (view) ->
  if m = view.match /(\@include\s*(.*)\(\')(.*)(\')/
    firstCharOfName = m[3].split('').reverse().pop().toUpperCase()
    name = firstCharOfName + m[3].slice(1, m[3].length)

###
@name capture_array
@description
Look for Response((...))
###

capture_array = (view) ->
  v = view.split('\n')
  counter++
  if m = view.match /(\@include\s*(.*))/
    if z = m[2].match /(.*)\(\(/
      z


###
@class
@name Parser
@description
Parser Contract Loader.
###

class Parser
  constructor: (@parsers) ->

  contract: (loaded, parser) ->
    if parser
      parser(loaded or '')
    else
      loaded
  parse: (content) ->
    c = content.split("\n")
    list = _.filter(@ready(view) for view in c)
  ready: (view) ->
    p = @parsers.reduce @contract, view


###
@class
@name Operation
###

class Operation
  constructor: (@op) ->
    @op


###
@class
@name Grammuelle
###

class Grammuelle

  p = new Parser [capture_module]

  constructor: () ->
    @schema = null
    @done = null
    open('./stylebook.grams').then (data) ->
      @schema = data

  initialize: () ->
    open().then (data) ->
      psb = p.parse data

      parseMap = _.map psb, (d) ->
        new Operation d

      _.each parseMap, (q, i) ->
        if @schema.match /%%SCSS_NAME%%/
          @schema = @schema.replace(/%%SCSS_NAME%%/g, q.op)
          @done = _.remove parseMap, (n) -> (n == i)
        else
          @schema = @schema.replace(/%%SCSS_INNER%%/g, q.op)

      log @schema


g = new Grammuelle
g.initialize()

