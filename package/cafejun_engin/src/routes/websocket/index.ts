import { FastifyPluginAsync } from 'fastify'
import { isReceiveAction } from '../../lib/websocket/actions/receive'
import { globalSubscriber } from '../../lib/websocket/redis/createRedisClient'
import Session from '../../lib/websocket/Session'

globalSubscriber

const websocket: FastifyPluginAsync = async fastify => {
  fastify.get('/', { websocket: true }, (connection, req) => {
    const session = new Session(connection.socket)

    connection.socket.on('message', message => {
      //connection.socket.send('hello world')
      try {
        const data = JSON.parse(message.toString())
        console.log(data)
        if (!isReceiveAction(data)) return
        session.handle(data)
        //logic
      } catch (e) {
        // 도중에 에러가
        console.error(e)
      }
    })
    connection.socket.on('close', (code, reaon) => {
      session.dispose()
    })
  })
}

export default websocket
