/**
 * Created by frank on 2017/6/23.
 */

module.exports = async function (ctx, next) {
  let {user} = ctx.state
  ctx.assert(user, 401, '必须登录')
  await next
}