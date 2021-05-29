import Session from '../Session'
import { globalSubscriber } from './createRedisClient'

// singtone

class Subscription {
  subscriptionMap = new Map<string, Set<Session>>()

  subscribe(key: string, session: Session) {
    const registered = this.subscriptionMap.has(key)
    //console.log('여기  통과? ')
    if (!registered) {
      globalSubscriber.subscribe(key)
      this.subscriptionMap.set(key, new Set())
    }
    const sessionSet = this.subscriptionMap.get(key)! // guaranteed to
    sessionSet.add(session)
    console.log(`${session.id} has subscribed to channel ${key}`)
    return () => {
      this.unsubscribe(key, session)
    }
  }
  unsubscribe(key: string, session: Session) {
    const sessionSet = this.subscriptionMap.get(key)
    if (!sessionSet) return
    sessionSet.delete(session)
    if (sessionSet.size === 0) {
      this.subscriptionMap.delete(key)
    }
  }
  dispatch(key: string, message: any) {
    const sessionSet = this.subscriptionMap.get(key)
    if (!sessionSet) return
    sessionSet.forEach(value => {
      value.sendSubscriptionMessage(key, message)
    })
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
