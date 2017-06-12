/**
 * Created by frank on 2017/6/6.
 */

const _ = require('lodash')
const moment = require('moment')
const simulator = require('../utils/simulator')

module.exports = {
  async findAll(ctx){
    let {seq, begin, end} = ctx.query
    let {Match} = ctx.models
    ctx.assert(seq, 400, 'seq required')
    let where = {seq}
    if (begin) {
      where.matchDate = {$gte: new Date(begin)}
    }
    if (end) {
      where.matchDate = {$lte: end}
    }
    let order = [['matchDate']]
    ctx.body = await Match.findAll({where, order})
  },

  /**
   * 计算间隔
   * @param ctx
   * @returns {Promise.<void>}
   */
  async executeRange(ctx){
    let {quota, target, seq, startDate, endDate} = ctx.query
    ctx.assert(seq, 400, 'invalid seq')
    let {Match} = ctx.models
    let where = {seq}
    if (startDate) {
      where.startDate = {$gte: startDate}
    }
    if (endDate) {
      where.endDate = {$lte: endDate}
    }
    let order = [['matchDate']]
    let matches = await Match.findAll({where, order})
    ctx.body = simulator.executeSeq(matches, quota, target)
  },

  async getLastScoreStateRange (ctx) {
    let {seq} = ctx.query
    let {Match} = ctx.models
    let where = {seq, scoreState: 'A'}
    let attributes = ['scoreState', 'matchDate']
    let order = [['matchDate', 'DESC']]
    let matches = await Match.findAll({where, attributes, order, limit: 1})
    let ret = {range: 0}
    if (!_.isEmpty(matches)) {
      let {matchDate} = matches[0]
      let where = {seq, scoreState: 'B', matchDate: {$gt: matchDate}}
      ret.range = await Match.count({where, order})
      ret.startDate = moment(matchDate).format('YYYY-MM-DD')
    }
    ctx.body = ret
  },

  async getSeqDateRange(ctx){
    let {seq} = ctx.query
    let order = [['matchDate', 'DESC']]
    let attributes = ['matchDate']
    let where = {seq}
    let {Match} = ctx.models
    let matches = await Match.findAll({where, attributes, order, limit: 1})
    let end = matches[0]
    order = [['matchDate']]
    matches = await Match.findAll({where, attributes, order, limit: 1})
    let start = matches[0]
    let startDate = moment(start.matchDate).format('YYYY-MM-DD')
    let endDate = moment(end.matchDate).format('YYYY-MM-DD')
    ctx.body = {startDate, endDate}

  }
}