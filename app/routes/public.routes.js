/**
 * Created by frank on 2017/6/5.
 */
module.exports = {
  prefix: '/public',
  ready: true,
  routes: [
    {
      path: '/',
      method: 'GET',
      handler: async (ctx) => {
        ctx.body = 'hello'
      }
    }
  ]
}