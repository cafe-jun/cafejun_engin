/**
import subscription from './../redis/subscription';
 * actions that server sends
 */

type connectedAction = {
  type: 'connected'
  id: string
  token: string
}

type GetIdSuccessAction = {
  type: 'getIdSuccess'
  id: string
}

type ReuseIdSuccessAction = {
  type: 'reuseIdSuccess'
}

type SubscriptionMessageAction = {
  type: 'subscriptionMessage'
  key: string
  message: any
}

type SubscriptionSuccess = {
  type: 'subscriptionSuccess'
  key: string
}

export type sendAction =
  | connectedAction
  | ReuseIdSuccessAction
  | SubscriptionMessageAction
  | SubscriptionSuccess

const actionCreators = {
  connected: (id: string, token: string): connectedAction => ({
    type: 'connected',
    id,
    token,
  }),

  getIdSuccess: (id: string): GetIdSuccessAction => ({
    type: 'getIdSuccess',
    id: id,
  }),
  reuseIdSuccess: (): ReuseIdSuccessAction => ({
    type: 'reuseIdSuccess',
  }),
  subscriptionMessage: (
    key: string,
    message: any
  ): SubscriptionMessageAction => ({
    type: 'subscriptionMessage',
    key,
    message,
  }),
  subscriptionSuccess: (key: string): SubscriptionSuccess => ({
    type: 'subscriptionSuccess',
    key,
  }),
}

export default actionCreators
