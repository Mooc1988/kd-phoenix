/**
 * Created by frank on 2017/6/6.
 */

const _ = require('lodash')
const moment = require('moment')
const simulator = require('../utils/simulator')
const num = require('../utils/num')

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
    let {start, end, week} = ctx.query
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
    if (week) {
      where.week = week
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

  async seqPairOddsRange(ctx){
    let seqs = ctx.query['seqs[]']
    seqs = _.map(seqs, seq => parseInt(seq))
    let towMonthBefore = moment().subtract('2', 'M').toDate()
    let {Match} = ctx.models
    let attributes = ['seq', 'scoreState', 'matchDate']
    let where = {seq: {$in: seqs}, matchDate: {$gte: towMonthBefore}}
    let order = [['seq'], ['matchDate']]
    let matches = await Match.findAll({attributes, where, order})
    let data = {}
    let ret = []
    _.forEach(matches, ({seq, scoreState, matchDate}) => {
      if (!data[matchDate]) {
        data[matchDate] = []
      }
      data[matchDate].push({seq, scoreState})
    })
    _.forEach(data, function (v, k) {
      if (_.size(v) === 2) {
        let scoreState = `${v[0].scoreState}${v[1].scoreState}`
        ret.push({scoreState, matchDate: k})
      }
    })
    let oj = simulator.executeRanges(ret, 'oddsRange', '偶奇')
    let jo = simulator.executeRanges(ret, 'oddsRange', '奇偶')
    let oo = simulator.executeRanges(ret, 'oddsRange', '偶偶')
    let jj = simulator.executeRanges(ret, 'oddsRange', '奇奇')
    let same = simulator.executeRanges(ret, 'oddsRange', '相同')
    let notSame = simulator.executeRanges(ret, 'oddsRange', '不同')
    let sizeSame = _.size(same.ranges)
    let sizeNotSame = _.size(notSame.ranges)
    if (sizeSame > 3 && sizeNotSame > 3) {
      same = executeRanges(same)
      notSame = executeRanges(notSame)
      jo = executeRanges(jo)
      oj = executeRanges(oj)
      jj = executeRanges(jj)
      oo = executeRanges(oo)
    }
    ctx.body = {same, notSame, oj, jo, oo, jj}
  },

  async oddsRange(ctx){
    let {target} = ctx.query
    let seqs = ctx.query['seqs[]']
    seqs = _.map(seqs, seq => parseInt(seq))
    let {Match} = ctx.models
    let attributes = ['seq', 'scoreState', 'matchDate']
    let where = {seq: {$in: seqs}}
    let order = [['seq'], ['matchDate']]
    let matches = await Match.findAll({attributes, where, order})
    let data = {}
    let ret = []
    _.forEach(matches, ({seq, scoreState, matchDate}) => {
      if (!data[matchDate]) {
        data[matchDate] = []
      }
      data[matchDate].push({seq, scoreState})
    })
    _.forEach(data, function (v, k) {
      if (v.length === seqs.length) {
        let scoreState
        if (seqs.length === 2) {
          scoreState = `${v[0].scoreState}${v[1].scoreState}`
        } else {
          scoreState = `${v[0].scoreState}${v[1].scoreState}${v[2].scoreState}`
        }
        ret.push({scoreState, matchDate: k})
      }
    })
    ctx.body = simulator.executeRanges(ret, 'oddsRange', target)
  },

  /**
   * 计算间隔
   * @param ctx
   * @returns {Promise.<void>}
   */
  async executeRange(ctx){
    let {quota, target, seq, startDate, endDate, week} = ctx.query
    ctx.assert(seq, 400, 'invalid seq')
    let {Match} = ctx.models
    let where = {seq}
    if (startDate) {
      where.startDate = {$gte: startDate}
    }
    if (endDate) {
      where.endDate = {$lte: endDate}
    }
    if (week) {
      where.week = week
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
    let {Match} = ctx.models

    let matches = []
    let {code, resp} = ctx.request.body
    if (code < 0) {
      return reject(new Error('超时'))
    }
    for (match of resp[1]['已完场']) {
      let {forecast, host_score, away_score, match_id, match_sn} = match
      let tmp = forecast.split(',')
      host_score = parseInt(host_score)
      away_score = parseInt(away_score)
      let matchResult = '1'
      if (host_score > away_score) {
        matchResult = '3'
      } else if (host_score < away_score) {
        matchResult = '0'
      }
      let isOk = tmp.includes(matchResult)
      let ret = {uid: match_id, seq: match_sn, isHit: isOk}
      matches.push(ret)
    }
    for (let match of matches) {
      let {uid, isHit} = match
      await Match.update({isHit}, {where: {uid}})
    }
    ctx.body = 'ok'
  }
}

function executeRanges (data) {
  let {growing, ranges} = data
  let newRanges = _.takeRight(ranges, 2)
  if (!growing) {
    newRanges[1] = 'x'
  }
  return newRanges
}