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
    const validQuotas = ['scoreState', 'sfOddsHl', 'rqOddsHl', 'sfResult', 'rqResult']
    let {quota, target, seq} = ctx.query
    ctx.assert(seq, 400, 'invalid seq')
    ctx.assert(quota && _.includes(validQuotas, quota), 400, 'invalid quota')
    ctx.assert(target, 400, 'invalid target')
    let {Match} = ctx.models
    let where = {seq}
    let attributes = [quota]
    let order = [['matchDate']]
    let matches = await Match.findAll({where, attributes, order})
    ctx.body = simulator.executeSeq(function (match) {
      let value = _.get(match, quota)
      return _.toString(value) === target
    }, matches)
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
  }
}