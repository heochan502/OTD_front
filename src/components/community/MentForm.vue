<template>
  <form class="ment-form" @submit.prevent="submitMent">
    <input v-model="newMent" placeholder="멘트를 입력하세요..." />
    <button type="submit">작성</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const newMent = ref('');

function submitMent() {
  if (newMent.value.trim()) {
    alert(`멘트 전송됨: ${newMent.value}`);
    newMent.value = '';
  }
}
</script>

<style scoped>
.ment-form {
  display: flex;
  padding: 16px 64px;
  background-color: white;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
}

.ment-form input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-right: 12px;
}

.ment-form button {
  padding: 12px 20px;
  background-color: #4fc3f7;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>
