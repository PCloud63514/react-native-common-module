export interface DataManager {
    storeKeyValue(key:any, value:any):void;
    getValueForKey(key:any):any;
}

export class MemoryDataManager implements DataManager {
    static instance:DataManager = new MemoryDataManager();
    private dataMap:Map<any,any> = new Map<any, any>();

    storeKeyValue(key: any, value: any): void {
        this.dataMap.set(key, value);
    }
    getValueForKey(key: any): any {
        return this.dataMap.get(key);
    }

}