import Session from '../Session'
import { globalSubscriber } from './createRedisClient'

// singtone

class Subscription {
  subscriptionMap = new Map()

  subscribe(key: string, session: Session) {
    const registered = this.subscriptionMap.has(key)
    if (!registered) {
      globalSubscriber.subscribe(key)
      this.subscriptionMap.set(key, new Set())
    }
    const sessionSet = this.subscriptionMap.get(key)! // guaranteed to
    sessionSet.add(session)
  }
  dispatch(key: string, message: any) {
      
  }
}

// type SubscriptionMap = Map<string, Set<Session>>

const subscription = new Subscription()
globalSubscriber.on('message', (channel, message) => {
  try {
    const parsed = JSON.parse(message)
    subscription.dispatch(channel, message)
  } catch (error) {
    console.error(`Fail to parse message from redis subscription ${message}`)
  }
})

export default subscription
