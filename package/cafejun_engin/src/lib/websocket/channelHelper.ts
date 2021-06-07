// 인스턴스까지 필요 없다
import { Message } from './actions/receive'
import { coreRedisClient, publishJSON } from './redis/createRedisClient'
import { promisify } from 'util'
import prefixer from './redis/prefixer'
import actionCreators from './actions/send'
import { SessionUser } from '../../services/sessionService'
import channelService from '../../services/channelService'

// const withPrefix = (channel: string) => `channel:${channel}`
// const createSessionsKey = (channel: string) => `${withPrefix(channel)}:users`

const channelHelper = {
  enter(channel: string, sessionId: string, user: SessionUser) {
    // coreRedisClient.publish(
    //   prefixer.channel(channel),
    //   JSON.stringify({
    //     type: 'enter',
    //     sessionId: sessionId,
    //   })
    // )
    publishJSON(
      prefixer.channel(channel),
      actionCreators.entered(sessionId, user)
    )
    // To Do : use channel Service
    channelService.addUser(channel, sessionId)
    //coreRedisClient.lpush(prefixer.sessions(channel), sessionId)
  },

  leave(channel: string, sessionId: string) {
    // coreRedisClient.publish(
    //   prefixer.channel(channel),
    //   JSON.stringify({
    //     type: 'leave',
    //     sessionId: sessionId,
    //   })
    // )
    publishJSON(prefixer.channel(channel), actionCreators.left(sessionId))
    // To Do : use channel Service
    // 사용자가 여러 채널이 들어와있는것을 방지
    channelService.removeUser(sessionId)
    // coreRedisClient.lrem(prefixer.sessions(channel), 1, sessionId)
  },
  message(channel: string, sessionId: string, message: Message) {
    publishJSON(
      prefixer.channel(channel),
      actionCreators.messaged(sessionId, message)
    )

    // coreRedisClient.publish(
    //   prefixer.channel(channel),
    //   JSON.stringify({
    //     type: 'leave',
    //     sessionId,
    //     message,
    //   })
    // )
  },
  // async listSessions(channel: string) {
  //   // To Do : use channel Service
  //   const sessions = channelService.listUser(channel)
  //   return sessions
  //   // const key = prefixer.sessions(channel)
  //   // this가 무엇인지를 몰라 bind를 해야한다
  //   // const lrangeAsync = promisify(coreRedisClient.lrange).bind(coreRedisClient)
  //   // return await lrangeAsync(key, 0, -1)
  // },
}

export default channelHelper
