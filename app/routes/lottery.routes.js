/**
 * Created by frank on 2017/6/6.
 */
module.exports = {
  prefix: '/api/lotteries',
  ready: true,
  routes: [
    {
      path: '/',
      method: 'POST',
      handler: 'Lottery.create'
    },
    {
      path: '/me',
      method: 'GET',
      handler: 'Lottery.findMyLotteries'
    },
    {
      path: '/:lotteryId/addBet',
      method: 'PUT',
      handler: 'Lottery.addBet'
    },
    {
      path: '/:lotteryId/end',
      method: 'PUT',
      handler: 'Lottery.endLottery'
    }
  ]
}