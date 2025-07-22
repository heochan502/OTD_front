<script setup>
import { useCommunityStore } from '@/stores/CommunityStore';
import MentForm from './MentForm.vue';

const store = useCommunityStore();

function addMent(text) {
  const newMent = {
    id: Date.now(),
    text,
  };
  store.selectedPost.ments.push(newMent);
}

function goBack() {
  store.clearPost();
}
</script>

<template>
  <div class="community-detail" v-if="store.selectedPost">
    <v-btn @click="goBack" variant="text" class="mb-4">← 목록으로</v-btn>

    <h2>{{ store.selectedPost.title }}</h2>
    <p>{{ store.selectedPost.content }}</p>

    <hr />

    <h3>댓글</h3>
    <ul>
      <li v-for="ment in store.selectedPost.ments" :key="ment.id">
        {{ ment.text }}
      </li>
    </ul>

    <MentForm @submit-ment="addMent" />
  </div>
</template>

<style scoped>
.community-detail {
  padding-left: 1rem;
}
</style>
