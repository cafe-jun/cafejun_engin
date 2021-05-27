// 인스턴스까지 필요 없다
import { Message } from './actions/receive'
import { coreRedisClient } from './redis/createRedisClient'
import Session from './Session'

const withPrefix = (channel: string) => `channel:${channel}`
const channelHelper = {
  enter(channel: string, sessionId: string) {
    coreRedisClient.publish(
      withPrefix(channel),
      JSON.stringify({
        type: 'enter',
        sessionId: sessionId,
      })
    )
  },

  leave(channel: string, sessionId: string) {
    coreRedisClient.publish(
      withPrefix(channel),
      JSON.stringify({
        type: 'leave',
        sessionId: sessionId,
      })
    )
  },
  message(channel: string, sessionId: string, message: Message) {
    coreRedisClient.publish(
      withPrefix(channel),
      JSON.stringify({
        type: 'leave',
        sessionId,
        message,
      })
    )
  },
}

export default channelHelper
