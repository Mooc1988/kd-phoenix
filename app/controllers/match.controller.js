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

  async findAllBySeq(ctx){
    let {seq} = ctx.params
    let where = {seq}
    let {start, end} = ctx.query
    if (start) {
      where.matchDate = {
        $gte: start
      }
    }
    if (end) {
      where.matchDate = {
        $lte: end
      }
    }
    let {Match} = ctx.models
    let attributes = ['scoreState', 'pScore', 'gScore', 'sfResult', 'sfOddsHl', 'rqResult', 'rqOddsHl', 'rqScore', 'matchDate']
    let order = [['matchDate']]
    let matches = await Match.findAll({where, order, attributes})
    let res = []
    _.forEach(matches, m => {
      let match = m.toJSON()
      match.matchDate = moment(match.matchDate).format('YYYY-MM-DD')
      match.winState = simulator.executeWinState(match)
      res.push(match)
    })
    ctx.body = matches
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
    ctx.body = simulator.executeRanges(matches, quota, target)
  },

  async getLastUpdateDate(ctx){
    let {seq} = ctx.query
    let where = {seq}
    ctx.assert(seq, 400, 'seq params required')
    let attributes = ['matchDate']
    let order = [['matchDate', 'DESC']]
    let {Match} = ctx.models
    let matches = await Match.findAll({where, attributes, order, limit: 1})
    ctx.assert(matches.length > 0, 400, '比赛不存在')
    let updateDate = moment(matches[0].matchDate).format('YYYY-MM-DD')
    ctx.body = {updateDate}
  },

  // 计算指标最后间隔
  async getLastRanges(ctx){
    let quotas = {
      'scoreState': ['A', 'B'],
      'sfResult': [1],
      'sfOddsHl': ['M', 'H'],
      'rqResult': [1],
      'rqOddsHl': ['M', 'H']
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