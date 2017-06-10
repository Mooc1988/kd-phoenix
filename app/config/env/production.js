/**
 * Created by frank on 2016/11/1.
 */

module.exports = {
  host: 'localhost',
  port: process.env.NODE_PORT || 7002,
  db: {
    database: 'db-zucai',
    username: 'mooc1988',
    password: 'Mooc1988',
    config: {
      host: 'rm-8vbk61x7h0vwb7oe1.pgsql.zhangbei.rds.aliyuncs.com',
      port: 3433,
      dialect: 'postgres'
    }
  },
  redisConfig: {
    host: 'localhost',
  }
}
