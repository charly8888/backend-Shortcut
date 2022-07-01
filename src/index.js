console.clear()
import fastifyCors from '@fastify/cors'
import Fastify from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import dbConnector from './our-db-connector.js'
import dataIcons from './routes/data-icons.js'
import dataUsers from './routes/data-users.js'

const fastify = Fastify({ logger: false })
const PORT = 3333

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

const start = async () => {
  try {
    await fastify.listen({ port: PORT })
    fastify.log.info(
      `Server listening on port ${fastify.server.address().port}`
    )
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
