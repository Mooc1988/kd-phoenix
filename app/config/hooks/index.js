/**
 * Created by frank on 2017/6/5.
 */
const router = require('./router')
const directory = require('./directory')
const config = require('./config')
const koa = require('./koa')
const redis = require('./redis')
const after = require('./after')
const database = require('./database')
module.exports = [
  config,
  database,
  koa,
  directory,
  router,
  after
]
