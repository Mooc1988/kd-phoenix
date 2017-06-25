/**
 * Created by frank on 2017/6/23.
 */

module.exports = {

  // 注册
  async register (ctx) {
    let {username, password} = ctx.request.body
    let {User} = ctx.models
    let user = await User.find({where: {username}})
    if (user) {
      ctx.throw(400, `该用户名已存在`)
    }
    user = User.build(ctx.request.body)
    if (!user.nickname) {
      user.nickname = username
    }
    user.salt = Date.now().toString()
    user.password = user.hashPassword(password)
    await user.save()
    ctx.body = user
  },

  // 登陆
  async login (ctx) {
    let {username, password} = ctx.request.body
    let {User} = ctx.models
    let {Jwt} = ctx.services
    let user = await User.find({where: {username}})
    if (!user || !user.authenticate(password)) {
      ctx.throw(400, '用户名或密码错误')
    }
    let {id, role} = user
    let token = Jwt.sign({id, username, role})
    ctx.body = {token}
  },
}