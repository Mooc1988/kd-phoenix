/**
 * Created by frank on 2017/6/23.
 */
'use strict'
module.exports = function (sequelize, DataTypes) {
  const {STRING, INTEGER, ARRAY, JSONB} = DataTypes
  const LotteryModel = sequelize.define('Lottery', {
    //场次
    seq: {
      type: INTEGER,
      allowNull: false,
      comment: '场次'
    },

    // 指标
    quota: {
      type: STRING,
      allowNull: false,
      comment: '投注指标'
    },

    // 状态
    state: {
      type: STRING,
      defaultValue: 'RUNNING'  // RUNNING: 进行  END：结束
    },
    // 每次下注 eg: {money:30, betDate:'2017-02-03'}
    bets: ARRAY(JSONB),
  }, {
    tableName: 'lottery'
  })

  LotteryModel.associate = function ({Lottery, User}) {
    Lottery.belongsTo(User)
  }
  return LotteryModel
}
