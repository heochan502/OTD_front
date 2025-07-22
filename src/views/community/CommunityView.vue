<template>
  <div class="community-container">
    <CommunityList v-if="!store.selectedPost" />
    <CommunityDetail
      v-else
      :post="store.selectedPost"
      @go-back="store.clearPost"
    />
  </div>
</template>

<script setup>
import { useCommunityStore } from '@/stores/CommunityStore';
import CommunityList from '@/components/community/CommunityList.vue';
import CommunityDetail from '@/components/community/CommunityDetail.vue';

const store = useCommunityStore();
</script>

<style scoped>
.community-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
