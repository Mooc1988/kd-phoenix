/**
 * Created by frank on 2017/7/7.
 */
const _ = require('lodash')

class Lottery {
  constructor (seq) {
    // 场次
    this.seq = seq
    // 失败次数
    this.failTimes = 0
    // 投注列表
    this.bets = []
  }

  makeBet (money, win) {
    this.bets.push(money)
    if (win) {
      this.failTimes = 0
    }
  }
}

class Simulator {

  constructor (maxFailTimes, startMoney, target) {
    this.maxFailTimes = maxFailTimes
    this.startMoney = startMoney
    this.target = target
    this.lotteries = []
    for (let seq = 1; seq < 11; seq++) {
      this.lotteries.push(new Lottery(seq))
    }
  }

  addMatches (matches) {
    // 当前比赛如果超过失败次数，则此次不投注
    let ignore = _.sumBy(matches, ({seq}) => {
      let {failTimes} = this.lotteries[seq]
      return failTimes < this.maxFailTimes ? 0 : 1
    })
    // 计算需要匀出的钱
    let totalAddition = ignore * this.startMoney * (2 << this.maxFailTimes - 2)
    let addition = Math.round(totalAddition / matches.length - ignore)

    _.forEach(matches, match => {
      let {seq, scoreState} = match
      let lottery = this.lotteries[seq]
      let isWin = scoreState === this.target
      if (!isWin) {
      } else {
      }
    })
  }

}

