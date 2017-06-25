'use strict'
const crypto = require('crypto')
module.exports = function (sequelize, DataTypes) {
  const {STRING} = DataTypes
  const UserModel = sequelize.define('User', {
    // 用户名
    username: {
      type: STRING(128),
      allowNull: false,
      unique: true
    },
    // 密码
    password: {
      type: STRING(128),
      allowNull: false
    },
    salt: {
      type: STRING(256),
      allowNull: false
    },
    // 姓名
    nickname: {
      type: STRING(128),
      allowNull: false
    },
    // 角色
    role: {
      type: STRING(128),
      allowNull: false,
      defaultValue: 'publisher'
    }
  }, {
    tableName: 'user'
  })
  UserModel.prototype.hashPassword = function (password) {
    if (this.salt && password) {
      return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64')
    } else {
      return password
    }
  }
  UserModel.prototype.authenticate = function (password) {
    return this.password === this.hashPassword(password)
  }
  return UserModel
}
