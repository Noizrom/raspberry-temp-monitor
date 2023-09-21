
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

export var WS_SERVER = `${WS_PROTOCOL}${SERVER.replace(PROTOCOL, "")}:${PORT}/ws`
console.log(`WS Server: ${WS_SERVER}`)

export interface Temp {
    temperature: number
}
export async function get_temp(newvalue_callback?: (temp: Temp) => void, connected?: ()=>void , disconnected?: ()=>void ) {
    var socket = new WebSocket(WS_SERVER)
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
            get_temp(newvalue_callback, connected, disconnected)
        }, 5000)
    }
    socket.onmessage = (msg) => {
        const data = JSON.parse(msg.data) as Temp
        newvalue_callback && newvalue_callback(data)
    }
}
