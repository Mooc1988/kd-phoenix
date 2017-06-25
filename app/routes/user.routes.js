/**
 * Created by frank on 2017/6/6.
 */
module.exports = {
  prefix: '/api/auth',
  ready: true,
  routes: [
    {
      path: '/register',
      method: 'POST',
      handler: 'User.register'
    },
    {
      path: '/login',
      method: 'POST',
      handler: 'User.login'
    }
  ]
}