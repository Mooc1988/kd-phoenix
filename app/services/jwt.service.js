/**
 * Created by frank on 2017/3/12.
 */
const jwt = require('jsonwebtoken')
const EXPIRES_IN = '7d'

module.exports = {
  sign (data) {
    let {jwtSecret} = global.App.config
    return jwt.sign(data, jwtSecret, {expiresIn: EXPIRES_IN})
  }
}
