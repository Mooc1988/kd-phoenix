/**
 * Created by frank on 2016/12/5.
 */
const _ = require('lodash')
const async = require('async')
const hooks = require('./hooks')

module.exports = function init (done) {
  global.App = this
  const _hooks = _.map(hooks, hook => cb => hook(this)(cb))
  async.series(_hooks, done)
}
