import { coreRedisClient, publishJSON } from './redis/createRedisClient'
import prefixer from './redis/prefixer'
import actionCreators from './actions/send'
import { Description } from './actions/common'


const rtcHelper = {
    call({ from, to, description }: { from: string; to: string, description: Description }) {
        publishJSON(prefixer.direct(to), actionCreators.called(from, description))
        // coreRedisClient.publish(prefixer.direct(to), JSON.stringify({
        //     type: 'call',
        //     from
        // })
        // )
    },
    answer({ from, to, description }: { from: string; to: string, description: Description }) {
        publishJSON(prefixer.direct(to), actionCreators.answered(from, description))
    },
    candidate({ from, to, candidate }: { from: string; to: string, candidate: any }) {
        publishJSON(prefixer.direct(to), actionCreators.candidated(from, candidate))
    }
}

export default rtcHelper