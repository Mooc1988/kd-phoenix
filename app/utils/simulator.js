/**
 * Created by frank on 2017/6/7.
 */
const _ = require('lodash')
const quotas = require('./quotas')
const matchMapper = new Map()
let START_MONEY = 100
let MAX_FOLLEW = 5

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
  },

  simToken(matches, matchDate){
    let top10 = matches.splice(0, 10)
    let total = executeTotalMoney(top10)
    _.forEach(top10, match => {
      let {seq, scoreState} = match
      let key = `seq_${seq}`
      let isOk = scoreState === '奇'
      let times = matchMapper.get(key)
      // 如果中了
      if (isOk) {

      } else {

      }
    })
  }
}

function executeTotalMoney (matches) {
  let totalMoney = 0
  _.forEach(matches, match => {
    let {seq} = match
    let key = `seq_${seq}`
    if (matchMapper.has(key)) {
      let times = matchMapper.get(key)
      totalMoney += START_MONEY * (2 << (times - 1 ))
    } else {
      totalMoney += START_MONEY
    }
  })
  return totalMoney
}

