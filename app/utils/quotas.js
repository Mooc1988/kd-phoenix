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
  }

}
