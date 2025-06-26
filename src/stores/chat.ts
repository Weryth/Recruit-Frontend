import { defineStore } from 'pinia'
import { ref } from 'vue'
import { connectWebSocket, sendWSMessage } from '@/websocket/socket'
import { getCurUser } from '@/api/users'

export interface ChatMessage {
  id: number
  text: string
  fromMe: boolean
  author: string
}
const userEmail = ref<string | null>(null)

const initUser = async () => {
  const user = await getCurUser()
  userEmail.value = user.email
}
export const useChatStore = defineStore('chat', () => {
  initUser()
  const messages = ref<ChatMessage[]>([])

  const addMessage = (msg: ChatMessage) => {
    messages.value.push(msg)
  }

  const sendMessage = async (text: string) => {
    const curUser = await getCurUser()
    addMessage({
      id: Date.now(),
      text,
      fromMe: true,
      author: curUser.email,
    })
    sendWSMessage(text, curUser.email)
  }

  const receiveMessage = (text, author: string) => {
    console.log(author)
    console.log(text)

    const isMine = text.author === userEmail.value

    if (isMine && !text.history) return

    const mine = isMine // true, если автор — текущий пользователь

    addMessage({
      id: Date.now(),
      text: text.text,
      fromMe: mine,
      author: text.author,
    })
  }

  const connect = () => {
    connectWebSocket((text) => {
      receiveMessage(text, '')
    })
  }

  return {
    messages,
    sendMessage,
    connect,
    receiveMessage,
  }
})
