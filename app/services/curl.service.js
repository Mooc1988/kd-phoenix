const {exec} = require('child_process')

module.exports = {
  curl(cmd){
    return new Promise(function (resolve, reject) {
      exec(cmd, (err, stdout) => {
        if (err) {
          return reject(err)
        }
        let doc = JSON.parse(stdout)
        let rets = []
        let {code, resp} = doc
        if (code < 0) {
          return reject(new Error('超时'))
        }
        let matches = resp[1]['已完场']
        for (match of matches) {
          let {forecast, host_half, away_score, match_id, match_sn} = match
          let tmp = forecast.split(',')
          let matchResult = '1'
          if (host_half > away_score) {
            matchResult = '3'
          } else if (host_half < away_score) {
            matchResult = '0'
          }
          let isOk = tmp.includes(matchResult)
          let ret = {uid: match_id, seq: match_sn, isHit: isOk}
          rets.push(ret)
        }
        return resolve(rets)
      })
    })
  }
}
