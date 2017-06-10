'use strict'

const NOT_FOUND_STATUS = 404;
const NOT_FOUND_BODY = {
  statusCode: NOT_FOUND_STATUS,
  error: 'Not Found',
  message: 'missing',
};

module.exports = async (ctx, next) => {
  try {
    await next()
    if (ctx.body === undefined && ctx.request.method !== 'OPTIONS') {
      ctx.status = NOT_FOUND_STATUS
      if (process.env.NODE_ENV === 'development') {
        ctx.body = NOT_FOUND_BODY
      } else {
        ctx.throw(404)
      }
    }
  } catch (err) {
    if (err.message === 'Validation error') {
      ctx.status = 400
      ctx.body = err.errors[0] || '验证错误'
    } else {
      ctx.body = {message: err.message}
      ctx.status = err.status || 500
      if (ctx.status >= 500) {
        console.error('request url: ', ctx.url)
        console.error('request body: ', ctx.request.body)
        console.error('request header: ', ctx.header)
        console.error()
        ctx.app.emit('error', err, ctx)
      }
    }
  }
}
