<script setup>
import { onMounted, watch, nextTick } from 'vue';
import { usecommunityStore } from '@/stores/community/communityStore';
import CommunityList from '@/components/community/CommunityList.vue';
import CommunityDetail from '@/components/community/CommunityDetail.vue';
import CommunityEdit from '@/components/community/CommunityEdit.vue';
import CommunityWrite from '@/components/community/CommunityWrite.vue';
import DialogProvider from '@/components/community/DialogProvider.vue';

const store = usecommunityStore();

onMounted(() => {
  store.loadPosts();
});

watch(
  () => store.viewMode,
  async () => {
    await nextTick();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
);
</script>

<template>
  <div class="community-container">
    <CommunityList v-if="store.viewMode === 'list'" />
    <CommunityDetail
      v-else-if="store.viewMode === 'detail' && store.selectedPost"
    />
    <CommunityEdit v-else-if="store.viewMode === 'edit'" />
    <CommunityWrite v-else-if="store.viewMode === 'write'" />
    <DialogProvider />
  </div>
</template>

<style scoped>
.community-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
