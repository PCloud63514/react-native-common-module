export interface EventListener {
    receive(flag:any):Promise<any>;
    dislose():Promise<any>;
}

// 원래라면 broadcast 할 때 채널이랑 플래그를 줘서 조건에 맞는 이벤트만 브로트캐스팅하는게 맞는데...
export interface EventHandler {
    addEventListener(e:EventListener, channel:string):Promise<void>;
    removeEventListener(e:EventListener, channel:string):Promise<EventListener|undefined>;
    broadcast(flag:any, channel:string):Promise<void>;
}

export class LifeCycleEventHandler implements EventHandler {
    private static instance:EventHandler = new LifeCycleEventHandler();

    static CHANNEL:string = "@SYSTEM";
    static DIDMOUNT_FLAG:number = 1
    static UNMOUNT_FLAG:number = -1

    private eventListeners:Map<string, Array<EventListener>> = new Map<string, Array<EventListener>>();

    async addEventListener(e: EventListener, channel: string=LifeCycleEventHandler.CHANNEL): Promise<void> {
        if (this.eventListeners.has(channel) == false) {
            this.eventListeners.set(channel, new Array<EventListener>())
        }
        this.eventListeners.get(channel)!!.push(e)
    }

    async removeEventListener(e: EventListener, channel: string=LifeCycleEventHandler.CHANNEL): Promise<EventListener|undefined> {
        if (this.eventListeners.has(channel) == false) throw new Error("Find Not EventListener")
        
        let arr:Array<EventListener> = this.eventListeners.get(channel)!!
        let data:any = undefined
        for (let i = 0; i < arr.length; ++i) {
            if (arr[i] === e) {
                data = arr.splice(i, 1)
                break
            }
        }
        return data
    }

    async didMount() {
        try {
            await this.broadcast(LifeCycleEventHandler.DIDMOUNT_FLAG, LifeCycleEventHandler.CHANNEL);
        } catch(error){
            console.log(error)
        }
    }    

    async unMount() {
        let arr = this.eventListeners.get(LifeCycleEventHandler.CHANNEL)
        if (arr == undefined || 0 == arr!!.length) throw new Error("channel is empty of eventListener")
        for (let i = 0; i < arr.length; ++i) {
            arr[i].dislose();
        }
    }

    async broadcast(flag: any, channel:string): Promise<void> {
        let arr = this.eventListeners.get(channel)
        if (arr == undefined || 0 == arr!!.length) throw new Error("channel is empty of eventListener")

        for (let i = 0; i < arr.length; ++i) {
            arr[i].receive(flag)
        }
    }
}