/**
 * Created by frank on 2017/6/20.
 */
const simulator = require('../utils/simulator')

module.exports = {
  /**
   * 计算间隔
   * @param ctx
   * @returns {Promise.<void>}
   */
  async executeRange(ctx){
    let {quota, target, seq} = ctx.query
    ctx.assert(quota, 400, 'quota required')
    ctx.assert(target, 400, 'target required')
    let {MatchAus} = ctx.models
    let where = {}
    if (seq) {
      where = {seq}
    }
    let order = [['round'], ['seq']]
    let matches = await MatchAus.findAll({where, order})
    ctx.body = simulator.executeRanges(matches, quota, target)
  },
}