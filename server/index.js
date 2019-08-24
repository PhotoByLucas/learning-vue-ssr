const R = require('ramda')
const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')


// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const MIDDLEWARES = ['router']


// 将服务器封装为一个类
class Server {
  constructor() {
    this.app = new Koa()
  }

  useMiddleWare(app) {

  }

  async start() {
    const nuxt = await new Nuxt(config)

    // Build in development
    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    } else {
      await nuxt.ready()
    }

    app.use((ctx) => {
      ctx.status = 200
      ctx.respond = false // Bypass Koa's built-in response handling
      ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
      nuxt.render(ctx.req, ctx.res)
    })

    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  }
}

const app = new Server()
app.start()