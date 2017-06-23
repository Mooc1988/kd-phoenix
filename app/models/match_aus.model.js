'use strict'
const crypto = require('crypto')
module.exports = function (sequelize, DataTypes) {
  const {STRING, INTEGER, FLOAT, ARRAY, DATEONLY} = DataTypes
  return sequelize.define('MatchAus', {
    round: {
      type: INTEGER,
      allowNull: false,
      comment: '轮次'
    },
    seq: {
      type: INTEGER,
      allowNull: false,
      comment: '场次'
    },
    pScore: {
      type: INTEGER,
      field: 'p_score',
      comment: '主队得分'
    },
    gScore: {
      type: INTEGER,
      field: 'g_score',
      comment: '客队得分'
    },
    scoreState: {
      type: STRING,
      field: 'score_state',
      comment: '分数状态'
    },
    sfResult: {
      type: INTEGER,
      field: 'sf_result',
      comment: '比赛结果'
    },
    sfOdds: {
      type: ARRAY(FLOAT),
      field: 'sf_odds',
      comment: '胜负赔率'
    },
    sfOddsHl: {
      type: STRING,
      field: 'sf_odds_hl',
      comment: '胜负赔率高低'
    },
    matchDate: {
      type: DATEONLY,
      field: 'match_date',
      comment: '比赛日期'
    }
  }, {
    tableName: 'match_aus',
    timestamps: false
  })
}
