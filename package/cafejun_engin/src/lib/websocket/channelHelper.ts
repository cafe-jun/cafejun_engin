// 인스턴스까지 필요 없다
import { Message } from './actions/receive'
import Session from './Session'
import { coreRedisClient, publishJSON } from './redis/createRedisClient'
import { promisify } from 'util'
import prefixer from './redis/prefixer'
import actionCreators from './actions/send'

// const withPrefix = (channel: string) => `channel:${channel}`
// const createSessionsKey = (channel: string) => `${withPrefix(channel)}:users`

const channelHelper = {
  enter(channel: string, sessionId: string) {
    publishJSON(prefixer.channel(channel), actionCreators.entered(sessionId))
    coreRedisClient.publish(
      prefixer.channel(channel),
      JSON.stringify({
        type: 'enter',
        sessionId: sessionId,
      })
    )
    coreRedisClient.lpush(prefixer.sessions(channel), sessionId)
  },

  leave(channel: string, sessionId: string) {
    publishJSON(prefixer.channel(channel), actionCreators.left(sessionId))
    coreRedisClient.publish(
      prefixer.channel(channel),
      JSON.stringify({
        type: 'leave',
        sessionId: sessionId,
      })
    )
    coreRedisClient.lrem(prefixer.sessions(channel), 1, sessionId)
  },
  message(channel: string, sessionId: string, message: Message) {
    publishJSON(prefixer.channel(channel), actionCreators.messaged(sessionId, message))

    coreRedisClient.publish(
      prefixer.channel(channel),
      JSON.stringify({
        type: 'leave',
        sessionId,
        message,
      })
    )
  },
  async listSessions(channel: string) {
    const key = prefixer.sessions(channel)
    // this가 무엇인지를 몰라 bind를 해야한다
    const lrangeAsync = promisify(coreRedisClient.lrange).bind(coreRedisClient)
    return await lrangeAsync(key, 0, -1)
  },
}

export default channelHelper