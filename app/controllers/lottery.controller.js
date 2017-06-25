/**
 * Created by frank on 2017/6/23.
 */

const moment = require('moment')
module.exports = {

  // 创建投注
  async create(ctx){
    let {user} = ctx.state
    ctx.assert(user, 401, 'require login')
    let {Lottery} = ctx.models
    let {money} = ctx.request.body
    let date = moment(new Date()).format('YYYY-MM-DD')
    let bet = {money, date}
    let lottery = Lottery.build(ctx.request.body)
    lottery.bets = [bet]
    lottery.UserId = user.id
    await lottery.save()
    ctx.body = lottery
  },

  // 获取对应用户的投注列表
  async findMyLotteries(ctx){
    let {user} = ctx.state
    ctx.assert(user, 401, 'require login')
    let {state} = ctx.query
    let {Lottery} = ctx.models
    let where = {UserId: user.id}
    let order = [['createdAt', 'DESC']]
    if (state) {
      where.state = state
    }
    ctx.body = await Lottery.findAll({where, order})
  },

  // 添加赌注
  async addBet(ctx){
    const {lotteryId} = ctx.params
    const {Lottery} = ctx.models
    let lottery = await Lottery.findById(lotteryId)
    ctx.assert(lottery, 400, '投注不存在')
    let {money} = ctx.request.body
    let date = moment(new Date()).format('YYYY-MM-DD')
    let {bets} = lottery
    bets.push({money, date})
    lottery.bets = bets
    await lottery.save()
    ctx.body = lottery
  },

  async endLottery(ctx) {
    const {lotteryId} = ctx.params
    const {Lottery} = ctx.models
    const {state} = ctx.request.body
    let lottery = await Lottery.findById(lotteryId)
    lottery.state = state
    await lottery.save()
    ctx.body = lottery
  }

}
