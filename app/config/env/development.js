/**
 * Created by frank on 2016/11/1.
 */

module.exports = {
  host: 'localhost',
  port: process.env.NODE_PORT || 4000,
  db: {
    database: 'db-zucai',
    username: 'frank',
    password: null,
    config: {
      host: 'localhost',
      dialect: 'postgres'
    }
  },
  redisConfig: {
    host: 'localhost'
  }
}
