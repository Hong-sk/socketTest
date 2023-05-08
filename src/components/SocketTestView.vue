<template>
  <div>
    <h1>1:1 Chat</h1>
    <div v-for="msg in messages" :key="msg.id">
      <strong>{{ msg.userId }}</strong>: {{ msg.message }}
    </div>
    <div>
      <input v-model="message" placeholder="Enter message" />
      <button @click="sendingMessage">Send</button>
    </div>
  </div>
  <!--  <h1>Test</h1>-->
</template>

<script setup>
// import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {
  ref, reactive, onMounted, onUnmounted,
} from 'vue';

import {useRoute} from "vue-router";

const stompClient = ref(null);

const connect = (userId, roomId) => {
  // sockJs를 사용한다면 주석 해제
  // const socket = new SockJS('http://localhost:8080/my-websocket');
  stompClient.value = new Client({
    // webSocketFactory: () => socket,
    brokerURL: 'ws://localhost:7999',
    onConnect: () => {
      console.log('Connected to WebSocket server');
      stompClient.value.subscribe(`/user/${userId}/queue/messages`, (message) => {
        console.log('Received:', JSON.parse(message.body));
      });
      joinRoom(roomId);
    },
    onStompError: (error) => {
      console.log('Error connecting to WebSocket server:', error);
    },
  });

  stompClient.value.activate();
};

const disconnect = () => {
  if (stompClient.value) {
    stompClient.value.deactivate();
  }
  console.log('Disconnected from WebSocket server');
};

const joinRoom = (roomName) => {
  console.log('It works!');
  stompClient.value.publish({
    destination: '/app/joinRoom',
    body: JSON.stringify({ roomName }),
  });
};

const leaveRoom = (roomName) => {
  stompClient.value.publish({
    destination: '/app/leaveRoom',
    body: JSON.stringify({ roomName }),
  });
};

const sendMessage = (roomName, content) => {
  stompClient.value.publish({
    destination: '/app/sendMessage',
    body: JSON.stringify({ roomName, content }),
  });
};

const message = ref('');
const messages = reactive([]);
const route = useRoute();

// const { roomId } = route.params;
// const { nickname } = route.query;

const roomId = 'roomId'
const nickname = 'mike'

const checkToken = () => {
  // 토큰 검증
  // 토큰이 합당하지 않다면 index.vue로 라우팅
  // 토큰이 roomId와 합당하고 유효하다면 return

};
checkToken();

const sendingMessage = () => {
  sendMessage(roomId, message.value);
};

onMounted(() => {
  connect(nickname, roomId);
});

onUnmounted(() => {
  disconnect();
});
</script>
