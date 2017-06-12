/**
 * Created by frank on 2017/6/7.
 */
const _ = require('lodash')
const quotas = require('./quotas')

module.exports = {

  /**
   *
   * @param list
   * @param quota
   * @param target
   * @returns {Array}
   */
  executeSeq(list, quota, target){
    let result = []
    let duration = 0
    let quotaHandler = quotas[quota]
    if (!quotaHandler) throw new Error(`invalid quota: ${quota}`)
    _.forEach(list, function processMatch (match) {
      if (quotaHandler(match, target)) {
        result.push(duration)
        duration = 0
      } else {
        duration += 1
      }
    })
    if (duration > 0) {
      result.push(duration)
    }
    return result
  }
}