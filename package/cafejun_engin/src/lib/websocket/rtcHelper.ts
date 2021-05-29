import { coreRedisClient, publishJSON } from './redis/createRedisClient'
import prefixer from './redis/prefixer'
import actionCreators from './actions/send'


const rtcHelper = {
    call({ from, to }: { from: string; to: string }) {
        publishJSON(prefixer.direct(to), actionCreators.called(from))
        // coreRedisClient.publish(prefixer.direct(to), JSON.stringify({
        //     type: 'call',
        //     from
        // })
        // )
    },
    answer({ from, to }: { from: string; to: string }) {
        publishJSON(prefixer.direct(to), actionCreators.answered(from))
    },
    candidate({ from, to }: { from: string; to: string }) {
        publishJSON(prefixer.direct(to), actionCreators.candidated(from))
    }
}

export default rtcHelper