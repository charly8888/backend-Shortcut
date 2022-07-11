import fastifyMongo from '@fastify/mongodb'
import dotenv from 'dotenv'
dotenv.config()

const userMongoAtlas = process.env.USER_MONGO_ATLAS
const pswMongoAtlas = process.env.PSW_MONGO_ATALS

console.log(userMongoAtlas, pswMongoAtlas)

const url = `mongodb+srv://${userMongoAtlas}:${pswMongoAtlas}@cluster0.eja0g.mongodb.net/data?retryWrites=true&w=majority`

async function dbConnector(fastify, options) {
  fastify.register(fastifyMongo, {
    forceClose: true,
    url,
  })
}
export default dbConnector
