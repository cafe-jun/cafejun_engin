/**
import subscription from './../redis/subscription';
 * actions that server sends
 */

import { Message } from './receive'
import { Description } from './common'
import { SessionUser } from '../../../services/sessionService'

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
  sessions: { id: string; user: any }[]
}
type EnteredAction = {
  type: 'entered'
  sessionId: string
  user: SessionUser
}
type LeftAction = {
  type: 'left'
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
  description: Description
}

type AnsweredAction = {
  type: 'answered'
  from: string
  description: Description
}

type CandidatedAction = {
  type: 'candidated'
  from: string
  candidate: any
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
  listSessionsSuccess: (
    sessions: {
      id: string
      user: any
    }[]
  ): ListSessionsSuccess => ({
    type: 'listSessionsSuccess',
    sessions,
  }),
  entered: (sessionId: string, user: SessionUser): EnteredAction => ({
    type: 'entered',
    sessionId,
    user,
  }),
  left: (sessionId: string): LeftAction => ({
    type: 'left',
    sessionId,
  }),
  messaged: (sessionId: string, message: Message): MessageAction => ({
    type: 'messaged',
    message,
    sessionId,
  }),
  called: (from: string, description: Description): CalledAction => ({
    type: 'called',
    from,
    description,
  }),
  answered: (from: string, description: Description): AnsweredAction => ({
    type: 'answered',
    from,
    description,
  }),
  candidated: (from: string, candidate: any): CandidatedAction => ({
    type: 'candidated',
    from,
    candidate,
  }),
}

export default actionCreators
