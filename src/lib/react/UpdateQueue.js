export class Update {
    constructor(payload) {
        this.payload = payload;
    }
}
export class UpdateQueue {
    constructor() {
        this.firstUpdate = this.lastUpdate = null;
    }
    enQueue(update) {
        if(!this.lastUpdate) {
            this.firstUpdate = this.lastUpdate = update;
        }else {
            this.lastUpdate.nextUpdate = update;
            this.lastUpdate = update;
        }
    }

    forceUpdate(state) {
        let nextUpdate = this.firstUpdate;
        while(nextUpdate) {
            let payload = nextUpdate.payload;
            let nextState = typeof payload === 'function'?payload(state):payload;
           if(typeof nextState !== 'object') {
                state = nextState;
           } else {
            state = {
                ...state,
                ...nextState
            }
           }
            nextUpdate = nextUpdate.nextUpdate;
        }
        this.firstUpdate = this.lastUpdate = null;
        return state;
    }
}