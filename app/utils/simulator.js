/**
 * Created by frank on 2017/6/7.
 */
const _ = require('lodash')
module.exports = {
  /**
   * 计算元素间隔
   * @param predicate
   * @param list
   * @returns {Array}
   */
  executeSeq(predicate, list){
    predicate = _.isFunction(predicate) ? predicate : (x) => x === predicate
    let result = []
    let duration = 0
    let started = false
    let last = list.length - 1
    _.forEach(list, (el, index) => {
      if (predicate(el)) {
        if (started) {
          result.push(duration)
          duration = 0
        } else {
          started = true
        }
      } else if (started) {
        duration += 1
        if (index === last) {
          result.push(duration)
        }
      }
    })
    return result
  }
}