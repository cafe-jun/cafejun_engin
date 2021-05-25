import { FastifyPluginAsync } from 'fastify'
import { isReceiveAction } from './lib/actions/receive'
import Session from './lib/Session'

const websocket: FastifyPluginAsync = async fastify => {
  fastify.get('/', { websocket: true }, (connection, req) => {
    const session = new Session()

    connection.socket.on('message', message => {
      //connection.socket.send('hello world')
      try {
        const data = JSON.parse(message.toString())
        if (!isReceiveAction(data)) return
      } catch (e) {}
    })
  })
}

export default websocket
