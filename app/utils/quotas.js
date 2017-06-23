/**
 * Created by frank on 2017/6/12.
 */
const _ = require('lodash')
const simulator = require('./simulator')
function executeWinState (match) {
  //1 0 -1
  let {pScore, gScore, rqScore} = match
  //平
  if (pScore === gScore) {
    return 'D'
  }
  let [weak, strong] = rqScore > 0 ? [pScore, gScore] : [gScore, pScore]

  // 冷
  if (weak > strong) {
    return 'C'
  }
  // 让平
  if (strong - Math.abs(rqScore) === weak) {
    return 'B'
  }
  // 打穿
  if (strong - Math.abs(rqScore) > weak) {
    return 'A'
  }
  return 'X'
}
module.exports = {

  scoreState: ({scoreState}, target) => scoreState === target,

  sfOddsHl: ({sfOddsHl}, target) => sfOddsHl === target,

  rqOddsHl: ({rqOddsHl}, target) => rqOddsHl === target,

  sfResult: ({sfResult}, target) => sfResult === parseInt(target),

  rqResult: ({rqResult}, target) => rqResult === parseInt(target),

  doubleM: ({sfOddsHl, rqOddsHl}, target) => sfOddsHl === 'M' || rqOddsHl === 'M',
  rqpM: ({sfOddsHl, rqResult}, target) => sfOddsHl === 'M' || rqResult === 1,

  winState: function (match, target) {
    return executeWinState(match) === target
  }

}
