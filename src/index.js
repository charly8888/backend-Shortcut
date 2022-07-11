console.clear()
import * as dotenv from 'dotenv'
dotenv.config()

import fastifyCors from '@fastify/cors'
import Fastify from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import dbConnector from './our-db-connector.js'
import dataIcons from './routes/data-icons.js'
import dataUsers from './routes/data-users.js'

const fastify = Fastify({ logger: false })

const port = process.env.PORT || 80
// console.log(process.env.PSW_MONGO_ATALS)
fastifyPlugin(dbConnector)

fastify.register(fastifyCors, {
  origin: true,
  // origin: (origin, cb) => {
  //   const hostname = new URL(origin).hostname
  //   if (hostname === 'localhost') {
  //     //  Request from localhost will pass
  //     cb(null, true)
  //     return
  //   }
  //   // Generate an error on other origins, disabling access
  //   cb(new Error('Not allowed'), false)
  // },
})

fastify.register(dbConnector)
fastify.register(dataIcons)
fastify.register(dataUsers)
fastify.get('/', async (req, res) => {
  return res.send('hello from back')
})

const start = async () => {
  try {
    await fastify.listen({ port })
    fastify.log.info(
      `Server listening on port ${fastify.server.address().port}`
    )
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
