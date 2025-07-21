<script setup>
import MentForm from './MentForm.vue';

const props = defineProps({
  post: Object,
});

const emit = defineEmits(['update-post']);

function addMent(text) {
  const newMent = {
    id: Date.now(),
    text,
  };
  props.post.ments.push(newMent);
  emit('update-post', props.post);
}
</script>

<template>
  <div class="community-detail" v-if="post">
    <h2>{{ post.title }}</h2>
    <p>{{ post.content }}</p>

    <hr />

    <h3>댓글</h3>
    <ul>
      <li v-for="ment in post.ments" :key="ment.id">{{ ment.text }}</li>
    </ul>

    <MentForm @submit-ment="addMent" />
  </div>
</template>

<style scoped>
.community-detail {
  padding-left: 1rem;
}
</style>
