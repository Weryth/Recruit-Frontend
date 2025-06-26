// src/services/ws.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket

type MessageData = { text: string; author?: string }

export function connectWebSocket(onMessage: (msg: MessageData) => void) {
  socket = io('http://localhost:3000') // Адрес сервера

  socket.on('connect', () => {
    console.log('Подключен к WebSocket')
  })

  socket.on('message', (data: MessageData) => {
    onMessage(data)
  })

  socket.on('disconnect', () => {
    console.warn('WebSocket отключен')
  })
}

export function sendWSMessage(text: string, author: string) {
  if (socket?.connected) {
    socket.emit('message', {
      text,
      author, // ✅ не подменяем!
    })
  }
}
