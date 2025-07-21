<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit-ment']);
const text = ref('');

function handleSubmit() {
  if (text.value.trim()) {
    emit('submit-ment', text.value);
    text.value = '';
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="ment-form">
    <input v-model="text" type="text" placeholder="댓글을 입력하세요" />
    <button type="submit">등록</button>
  </form>
</template>

<style scoped>
.ment-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
input {
  flex: 1;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
</style>
