import React from 'react'
import DBManager from '../../db/DBManager'
declare global {
    type NetworkException = 
    {
        errorCode:number
        request(rest:IRestfulService, error?:any):Promise<any>
    }
}

// 토큰 만료 예외처리
export class TokenNetworkException implements NetworkException {
    errorCode:number = 401
    async request(rest:IRestfulService, error?:any): Promise<any> {
        const config = error!.config
        const refreshToken = await DBManager.Instance().Get('refreshToken')
        config.headers['refreshToken'] = refreshToken

        return await rest.RetryRequest(config)
    }
}

// 명령, 서버등 비동작 예외처리
export class ServerInspectionException implements NetworkException {
    errorCode:number = 500
    async request(error?:any): Promise<any> {
        console.log(error)
        throw new Error(error)
    }

}