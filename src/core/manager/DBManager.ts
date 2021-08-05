import SQLite, {SQLiteDatabase } from 'react-native-sqlite-storage'
import { EventListener } from '@utils/Event';
SQLite.enablePromise(true)

const DB_NAME = "LocalDB.db"
const DB_VERSION = "1.0";
const DB_DISPLAY_NAME = "SQLITE-LOCAL"
const TABLE_NAME = "Local"

export interface DBManager {
    init():Promise<void>;
    insert(key:string, value:any):Promise<void>;
    update(key:string, value:any):Promise<void>;
    select(key:string):Promise<any>;
    delete(key:string):Promise<boolean>;
}

abstract class AbstractDBManager implements DBManager {
    private _db:SQLiteDatabase|undefined = undefined
    protected _dbName:string
    protected _tableName:string
    protected _dbVersion:string
    protected _dbDisplayName:string

    constructor(dbName:string=DB_NAME, dbVersion: string=DB_VERSION, dbDisplayName: string=DB_DISPLAY_NAME, tableName=TABLE_NAME) {
        this._dbName = dbName
        this._dbVersion = dbVersion
        this._dbDisplayName = dbDisplayName
        this._tableName = tableName
    }

    async init(): Promise<void> {
        const query = `CREATE TABLE IF NOT EXISTS ${this._tableName}("key" TEXT NOT NULL, "value" TEXT NOT NULL, PRIMARY KEY("key"))`
        this._db = this.openDatabase(this._dbName)["_W"]

        await this._db?.transaction((tx:SQLite.Transaction) => {
            tx.executeSql(query, [])
        })
    }

    db():SQLiteDatabase {
        if (this._db == undefined) throw new Error("DB Instance is undefined")
        return this._db
    }

    openDatabase(dbName:string):any {
        return SQLite.openDatabase({name:dbName, createFromLocation:'~www/' + DB_NAME, location:'default'})
    }

    abstract insert(key: string, value: any): Promise<void>;
    abstract update(key: string, value: any): Promise<void>;
    abstract select(key: string): Promise<any>;
    abstract delete(key: string): Promise<boolean>;
}

export class LocalDBManager extends AbstractDBManager implements EventListener {
    static instance:DBManager = new LocalDBManager();

    async insert(key: string, value: any): Promise<void> {
        let query = `Insert into ${this._tableName}(key, value) values("${key}", "${value}")`
        let response = undefined
        await this.db().transaction((tx) => {
            tx.executeSql(query, [], (_, {rows})=> {
                response = rows.item(0).value
            })
        })
        if (response == undefined) throw new Error("insert Fail query:" + query)
        return response
    }

    async update(key: string, value: any): Promise<void> {
        let query = `Update ${this._tableName} SET value="${value}" where key="${key}"`
        await this.db().executeSql(query)
    }
    
    async select(key: string): Promise<any> {
        let query = `Select * from ${this._tableName} where key=${key}`
        let response = undefined
        await this.db().transaction((tx)=> {
            tx.executeSql(query, [], (_, {rows}) => {
                response = rows.item(0).value
            })
        })
        if (response == undefined) throw new Error("Select Fail query:" + query)
        return response
    }

    async delete(key: string): Promise<boolean> {
        let query = `delete from ${this._tableName} where key="${key}"`
        let response = true
        this.db().transaction((tx)=> {
            tx.executeSql(query, [], (_, {rows})=>{response = true}, (error)=>{response = false})
        })
        return response
    }

    async receive(flag: any): Promise<any> {
        await this.init();
    }
    
    async dislose(): Promise<any> {
        await this.db().close()
    }
}