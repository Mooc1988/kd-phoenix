/**
 * Created by frank on 2017/7/21.
 */


module.exports = {
  // 排列组合
  combination (arr) {
    let ret = []
    let len = arr.length
    for (let i = 0; i < len; i++) {
      let f = arr[i]
      for (let j = i + 1; j < len; j++) {
        let s = arr[j]
        ret.push([f, s])
      }
    }
    return ret
  }
}


