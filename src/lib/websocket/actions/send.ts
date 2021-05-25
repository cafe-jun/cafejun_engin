/**
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
  message: any
}

export type sendAction =
  | connectedAction
  | ReuseIdSuccessAction
  | SubscriptionMessageAction

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
  subscriptionMessage: (message: any) => ({
    type: 'subscriptionMessage',
    message,
  }),
}

export default actionCreators
