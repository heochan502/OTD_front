<script setup>
const props = defineProps({
  posts: Array,
});
</script>

<template>
  <div class="community-list">
    <h2>커뮤니티 목록</h2>
    <ul>
      <li v-for="post in posts" :key="post.id" @click="$emit('select', post)">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.community-list {
  border-right: 1px solid #ccc;
  padding-right: 1rem;
}
.community-list li {
  cursor: pointer;
  margin: 0.5rem 0;
}
</style>
