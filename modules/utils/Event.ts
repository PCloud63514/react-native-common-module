import { ExceptionPromise } from '.'
declare global {
    interface IEventListener {
        receive():Promise<void>
        dispose():Promise<void>
    }
}

export class EventHandler {
    static _eventList:Array<EventListener> = new Array<EventListener>()

    static async addEventListener(e: EventListener, initCall:Boolean=true): Promise<void> {
        try {
            if(EventHandler._eventList.indexOf(e) === -1) {
                await e.receive()
                EventHandler._eventList.push(e)
            }
        }catch(err) {
            throw(err)
        }
    }
    static removeEventListener(e: EventListener): void {
        let index = EventHandler._eventList.indexOf(e)
        EventHandler._eventList.splice(index, 1)
    }
    static broadcast = async() => {
        return await ExceptionPromise(() => {
            EventHandler._eventList.forEach((value) => {
                value.receive()
            })
        })
    }
    static dispose = async() => {
        return await ExceptionPromise(() => {
            while(EventHandler._eventList.length > 0) {
                let eventListener = EventHandler._eventList.pop()
                eventListener?.dispose()
            }
        })
    }
}

export class EventListener implements IEventListener{
    receive = async () => {
    }

    dispose = async () => {
    }
}