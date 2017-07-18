/**
 * Created by frank on 2017/6/12.
 */

module.exports = {

  scoreState: ({scoreState}, target) => scoreState === target,

  sfOddsHl: ({sfOddsHl}, target) => sfOddsHl === target,

  rqOddsHl: ({rqOddsHl}, target) => rqOddsHl === target,

  sfResult: ({sfResult}, target) => sfResult === parseInt(target),

  rqResult: ({rqResult}, target) => rqResult === parseInt(target),

  doubleM: ({sfOddsHl, rqOddsHl}, target) => sfOddsHl === 'M' || rqOddsHl === 'M',

  rqpM: ({sfOddsHl, rqResult}, target) => sfOddsHl === 'M' || rqResult === 1,

  winState: ({winState}, target) => winState === target,

  allScore: ({pScore, gScore}, target) => {
    let isAll = pScore > 0 && gScore > 0
    return target === '是' ? isAll : !isAll
  },

  doubleThree: ({sfResult, rqResult}, target) => {
    return sfResult === 0 && rqResult === 0
  },

  oddsRange: ({scoreState}, target) => {
    if (target === '不同') {
      return scoreState === '奇偶' || scoreState === '偶奇'
    }
    if (target === '相同') {
      return scoreState === '奇奇' || scoreState === '偶偶'
    }
    if (target === '不同3') {
      return scoreState !== '奇奇奇' && scoreState !== '偶偶偶'
    }
    if (target === '相同3') {
      return scoreState === '奇奇奇' || scoreState === '偶偶偶'
    }
    return scoreState === target
  }

}
