/**
 * Created by frank on 2017/6/12.
 */
const _ = require('lodash')

module.exports = {

  scoreState: ({scoreState}, target) => scoreState === target,

  sfOddsHl: ({sfOddsHl}, target) => sfOddsHl === target,

  rqOddsHl: ({rqOddsHl}, target) => rqOddsHl === target,

  sfResult: ({sfResult}, target) => sfResult === parseInt(target),

  rqResult: ({rqResult}, target) => rqResult === parseInt(target)
}
