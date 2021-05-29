/**
import subscription from './../redis/subscription';
 * actions that server sends
 */

import { Message } from "./receive"

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

type ListSessionsSuccess = {
  type: 'listSessionsSuccess'
  sessions: string[]
}
type EnteredAction = {
  type: 'entered'
  sessionId: string
}
type LeftAction = {
  type: "left"
  sessionId: string
}
type MessageAction = {
  type: 'messaged'
  sessionId: string
  message: Message
}


type CalledAction = {
  type: 'called'
  from: string
}

type AnsweredAction = {
  type: 'answered'
  from: string
}

type CandidatedAction = {
  type: 'candidated'
  from: string
}

export type sendAction =
  | connectedAction
  | ReuseIdSuccessAction
  | SubscriptionMessageAction
  | SubscriptionSuccess
  | ListSessionsSuccess
  | EnteredAction
  | LeftAction
  | MessageAction
  | CalledAction
  | AnsweredAction
  | CandidatedAction

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
  listSessionsSuccess: (sessions: string[]): ListSessionsSuccess => ({
    type: 'listSessionsSuccess',
    sessions,
  }),
  entered: (sessionId: string): EnteredAction => ({
    type: 'entered',
    sessionId
  }),
  left: (sessionId: string): LeftAction => ({
    type: 'left',
    sessionId
  }),
  messaged: (sessionId: string, message: Message): MessageAction => ({
    type: 'messaged',
    message,
    sessionId,
  }),
  called: (from: string): CalledAction => ({
    type: 'called',
    from,
  }),
  answered: (from: string): AnsweredAction => ({
    type: 'answered',
    from,
  }),
  candidated: (from: string): CandidatedAction => ({
    type: 'candidated',
    from
  })

}

export default actionCreators