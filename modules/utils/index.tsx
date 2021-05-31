import { Dimensions, Platform, PixelRatio } from 'react-native'
import { StyleSheet } from 'react-native'
import ss from '../../config/strings'
const { width, height } = Dimensions.get('window')

export const strings = ss
export const screenWidth = width
export const screenHeight = height
const scale = screenWidth / 320
export const headerHeight = screenHeight * 0.01 * 10

function zeroPlus(target:number):string {
    let t:string = target >= 10 ? String(target) : "0" + target
    return t
}

export function GetServerFormatDate(date:Date) {
    var year = date.getFullYear()
    var month:string = zeroPlus(1 + date.getMonth())
    var day:string = zeroPlus(date.getDate())
    var hour = zeroPlus(date.getHours())
    var minute = zeroPlus(date.getMinutes())

    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":00"
}

export function GetFormatDate(date:Date) {
    var year = date.getFullYear()
    var month:string = zeroPlus(1 + date.getMonth())
    var day:string = zeroPlus(date.getDate())
    var hour = zeroPlus(date.getHours())
    var minute = zeroPlus(date.getMinutes())
    return year + '년 ' + month + '월 ' + day + '일 ' + hour + '시 ' + minute + '분'
}

export function utils_normalize(size:number) {
    const newSize = size * scale
    if ( Platform.OS === 'android') {
        return Math.abs(Math.round(PixelRatio.roundToNearestPixel(newSize) - 2))
    }
    else if( Platform.OS === 'ios') {
        return Math.abs(Math.round(PixelRatio.roundToNearestPixel(newSize)))
    }
}

export const ExceptionPromise = async(func:any) => {
    const result:any = await new Promise((resolve, reject) => {
        try {
            resolve(func())
        }catch(err) {
            reject(err)
        }
    })
    return result
}


declare global {
    type BoundType = {
        origin: {
            x:number,
            y:number
        },
        size: {
            width:number,
            height:number
        }
    }

    type IException = {
        code:number|undefined,
        message:string|undefined
        callback:()=>void
    }

}

export class Exception implements IException {
    code: number | undefined
    message: string | undefined
    callback: () => void
    constructor(code:number|undefined=undefined, message:string|undefined=undefined, callback:()=>void=()=>{}) {
        this.code = code
        this.message = message
        this.callback = callback
    }

}

export const GetBoundInfo = (boundSizePercentage:number, threshold:number=headerHeight) => {
    let width = screenWidth * 0.01 * boundSizePercentage
    let origin_x = (screenWidth -  width) / 2
    let origin_y = ((screenHeight - threshold) - width) / 2
    let bound:BoundType = {
        origin: {
            x: origin_x,
            y:origin_y
        },
        size: {
            width: width,
            height:width
        }
    }

    return bound
}


//퍼센트 기준 계산
export const BoundException = (standardBounds:BoundType, targetBounds:BoundType) => {
    let x2 = standardBounds.origin.x + standardBounds.size.width
    let y2 = standardBounds.origin.y + standardBounds.size.width

    let rect = {
        x: (Number(targetBounds.origin.x) > standardBounds.origin.x) && (x2 > Number(targetBounds.origin.x) + Number(targetBounds.size.width)),
        y:(Number(targetBounds.origin.y) > standardBounds.origin.y) && (y2 > Number(targetBounds.origin.y) + Number(targetBounds.size.height)),
        w:standardBounds.size.width > Number(targetBounds.size.width),
        h:standardBounds.size.height > Number(targetBounds.size.height)
    }
    if(!(rect.x && rect.y && rect.w && rect.h)) {
        throw 'Bound 범위 벗어남.'
    }
}