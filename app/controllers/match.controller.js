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
    let order = [['matchDate']]
    let matches = await Match.findAll({where, order})
    let res = []
    _.forEach(matches, m => {
      let match = m.toJSON()
      match.matchDate = moment(match.matchDate).format('YYYY-MM-DD')
      match.totalScore = match.pScore + match.gScore
      match.allScore = match.pScore > 0 && match.gScore > 0
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
      'scoreState': ['奇', '偶'],
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
  },

  async curlCaiqr(ctx){
    let {cmd} = ctx.request.body
    ctx.assert(cmd, 400, 'cmd参数不足')
    let {Match} = ctx.models
    let {Curl} = ctx.services
    let matches = await Curl.curl(cmd)
    for (let match of matches) {
      console.log(match)
      let {uid, isHit} = match
      await Match.update({isHit}, {where: {uid}})
    }
    ctx.body = 'ok'
  }

}