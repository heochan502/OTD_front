<template>
  <div class="community-container">
    <CommunityList />
    <MentForm />
  </div>
</template>

<script setup>
import CommunityList from '@/components/community/CommunityList.vue';
import MentForm from '@/components/community/MentForm.vue';
</script>

<style scoped>
.community-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
