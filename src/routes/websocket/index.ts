import { FastifyPluginAsync } from 'fastify'
import { isReceiveAction } from '../../lib/websocket/actions/receive'
import Session from '../../lib/websocket/Session'

const websocket: FastifyPluginAsync = async fastify => {
  fastify.get('/', { websocket: true }, (connection, req) => {
    const session = new Session(connection.socket)

    connection.socket.on('message', message => {
      //connection.socket.send('hello world')
      try {
        const data = JSON.parse(message.toString())
        session.handle(data)
        if (!isReceiveAction(data)) return
        //logic
      } catch (e) {
        // 도중에 에러가
        console.error(e)
      }
    })
  })
}

export default websocket
