'use strict'
const crypto = require('crypto')
module.exports = function (sequelize, DataTypes) {
  const {STRING, INTEGER, FLOAT, ARRAY, DATEONLY} = DataTypes
  return sequelize.define('Match', {
    seq: {
      type: INTEGER,
      allowNull: false,
      comment: '比赛场次'
    },
    uid: {
      type: STRING(128),
      allowNull: false,
      comment: 'uid'
    },
    week: {
      type: STRING,
      allowNull: false,
      comment: '比赛周'
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
    state: {
      type: STRING,
      comment: '比赛状态'
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
    rqResult: {
      type: INTEGER,
      field: 'rq_result',
      comment: '让球结果'
    },
    rqOdds: {
      type: ARRAY(FLOAT),
      field: 'rq_odds',
      comment: '让球赔率'
    },
    rqOddsHl: {
      type: STRING,
      field: 'rq_odds_hl',
      comment: '让球赔率高低'
    },
    rqScore: {
      type: INTEGER,
      field: 'rq_score',
      comment: '让球分数'
    },
    scoreState: {
      type: STRING,
      field: 'score_state',
      comment: '分数状态'
    },
    matchDate: {
      type: DATEONLY,
      field: 'match_date',
      comment: '比赛日期'
    }
  }, {
    tableName: 'match',
    timestamps: false,
    defaultScope: {
      where: {
        state: '完'
      }
    }
  })
}
