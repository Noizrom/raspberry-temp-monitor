// This Thing works in any deployment environment. do not touch
var SERVER = 'http://localhost'
var PORT = '8000'

if (import.meta.env.PROD) {
    SERVER = location.hostname
    PORT = location.port
}
console.log(`Server: ${SERVER}`)
console.log(`Port: ${PORT}`)

// get if https or http
const PROTOCOL = location.protocol
console.log(`Protocol: ${PROTOCOL}`)

// set if using ws or wss
const WS_PROTOCOL = PROTOCOL === 'https:' ? 'wss:' : 'ws:'
console.log(`WS Protocol: ${WS_PROTOCOL}`)

const get_websocket_url = (endpoint: string) => {
    // end point should start with a /
    return `${WS_PROTOCOL}//${SERVER.replace(PROTOCOL, "")}:${PORT}${endpoint}`
}
// export var WS_SERVER = `${WS_PROTOCOL}${SERVER.replace(PROTOCOL, "")}:${PORT}/ws`

// ==================== API ====================

export interface DataResponse {
    data: number
}

export async function connect_websocket(endpoint: string, newvalue_callback?: (data: DataResponse) => void, connected?: ()=>void , disconnected?: ()=>void ) {
    var socket = new WebSocket(get_websocket_url(endpoint))
    console.log('socket', socket)
    socket.onopen = () => {
        console.log('connected')
        connected && connected()
    }
    socket.onclose = () => {
        console.log('disconnected')
        disconnected && disconnected()
        // try to reconnect every 5 seconds
        setTimeout(() => {
            connect_websocket(endpoint, newvalue_callback, connected, disconnected)
        }, 5000)
    }
    socket.onmessage = (msg) => {
        const data = JSON.parse(msg.data) as DataResponse
        newvalue_callback && newvalue_callback(data)
    }
}



// == Deprecated ==
// export interface Temp {
//     temperature: number
// }
// export async function get_temp(newvalue_callback?: (temp: Temp) => void, connected?: ()=>void , disconnected?: ()=>void ) {
//     var socket = new WebSocket(WS_SERVER)
//     console.log('socket', socket)
//     socket.onopen = () => {
//         console.log('connected')
//         connected && connected()
//     }
//     socket.onclose = () => {
//         console.log('disconnected')
//         disconnected && disconnected()
//         // try to reconnect every 5 seconds
//         setTimeout(() => {
//             get_temp(newvalue_callback, connected, disconnected)
//         }, 5000)
//     }
//     socket.onmessage = (msg) => {
//         const data = JSON.parse(msg.data) as Temp
//         newvalue_callback && newvalue_callback(data)
//     }
// }


