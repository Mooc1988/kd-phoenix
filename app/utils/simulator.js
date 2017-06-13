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
  executeRanges(list, quota, target){
    let ranges = []
    let duration = 0
    let quotaHandler = quotas[quota]
    let growing = false
    if (!quotaHandler) {
      throw new Error(`invalid quota: ${quota}`)
    }
    _.forEach(list, function processMatch (match) {
      if (quotaHandler(match, target)) {
        ranges.push(duration)
        duration = 0
      } else {
        duration += 1
      }
    })
    if (duration > 0) {
      ranges.push(duration)
      growing = true
    }
    return {ranges, growing}
  },

  executeLast2Ranges(matches, quota, target){
    let quotaHandler = quotas[quota]
    if (!quotaHandler) {
      throw new Error(`invalid quota: ${quota}`)
    }
    let ranges = [0, 0]
    let matchLength = matches.length
    // 记录target出现的次数
    let times = 0
    for (let i = 0; i < matchLength; i++) {
      let match = matches[i]
      if (quotaHandler(match, target)) {
        times += 1
        if (times >= 2) {
          break
        }
      } else {
        let index = times === 0 ? 1 : 0
        ranges[index] += 1
      }
    }
    if (quotaHandler(matches[0], target)) {
      ranges[1] = 'x'
    }
    return ranges
  }

}