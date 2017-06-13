/**
 * Created by frank on 2017/6/6.
 */

const _ = require('lodash')
const moment = require('moment')
const simulator = require('../utils/simulator')

module.exports = {
  async findAll(ctx){
    let {seq, dateRange} = ctx.query
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
    let {ranges, growing} = simulator.executeRanges(matches, quota, target)
    ctx.body = ranges
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
  },

  // 计算指标最后间隔
  async getLastRanges(ctx){
    let quotas = {
      'scoreState': ['A', 'B'],
      'sfResult': [1],
      'sfOddsHl': ['M'],
      'rqResult': [1],
      'rqOddsHl': ['M']
    }
    let {seq} = ctx.query
    let where = {seq}
    let attributes = ['scoreState', 'sfResult', 'sfOddsHl', 'rqResult', 'rqOddsHl', 'matchDate']
    let order = [['matchDate', 'DESC']]
    let {Match} = ctx.models
    let matches = await Match.findAll({where, attributes, order, limit: 70})
    let ret = {}
    _.forEach(quotas, (targets, quota) => {
      ret[quota] = []
      _.forEach(targets, target => {
        let ranges = simulator.executeLast2Ranges(matches, quota, target)
        ret[quota].push({
          target, ranges
        })
      })
    })
    ctx.body = ret
  }

}