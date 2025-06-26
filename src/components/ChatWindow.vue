<template>
  <div class="chat-window">
    <el-scrollbar class="chat-messages">
      <div
        v-for="msg in chat.messages"
        :key="msg.id"
        :class="['message-wrapper', msg.fromMe ? 'right' : 'left']"
      >
        <div class="message">
          <div class="author">{{ msg.author }}</div>
          <div class="text">{{ msg.text }}</div>
        </div>
      </div>
    </el-scrollbar>

    <el-input v-model="newMessage" placeholder="Введите сообщение" @keyup.enter="handleSend">
      <template #append>
        <el-button @click="handleSend">Отправить</el-button>
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { connectWebSocket } from '@/websocket/socket' // правильное имя функции

const chat = useChatStore()
const newMessage = ref('')

function handleSend() {
  if (newMessage.value.trim() !== '') {
    chat.sendMessage(newMessage.value.trim())
    newMessage.value = ''
  }
}

onMounted(() => {
  connectWebSocket((data: { text: string; author?: string }) => {
    // Передаём весь объект, чтобы отображать имя
    chat.receiveMessage({
      text: data.text,
      author: data.author || 'Собеседник',
      fromMe: false, // Отмечаем, что это чужое сообщение
      id: Date.now(), // или любой уникальный идентификатор
      timestamp: Date.now(),
    })
  })
})
</script>

<style scoped>
.chat-window {
  height: 600px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 12px;
}
.chat-messages {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.message-wrapper {
  display: flex;
}

.message-wrapper.right {
  justify-content: flex-end;
}

.message-wrapper.left {
  justify-content: flex-start;
}

.message {
  margin-top: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px 12px;
  max-width: max-content; /* чтобы ширина по контенту */
  max-width: 60%;
  display: flex;
  flex-direction: column;
  word-break: break-word;
}

.message-wrapper.right .message {
  background-color: #d9f7be;
  align-items: flex-end;
}

.message-wrapper.left .message {
  background-color: #ffffff;
  align-items: flex-start;
}

.author {
  font-size: 12px;
  font-weight: bold;
  color: #999;
  margin-bottom: 4px;
  text-align: left;
}

.message-wrapper.right .author {
  text-align: right;
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid #ddd;
}
</style>
