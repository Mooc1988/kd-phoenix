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
  // db: {
  //   database: 'db-zucai',
  //   username: 'mooc1988',
  //   password: 'Mooc1988',
  //   config: {
  //     host: "rdsfom58rh8q9mrl8885o.pg.rds.aliyuncs.com",
  //     port: 3433,
  //     dialect: 'postgres'
  //   }
  // },
  redisConfig: {
    host: 'localhost'
  }
}
