<script setup>
import { computed } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';
import CommunityList from '@/components/community/CommunityList.vue';
import CommunityDetail from '@/components/community/CommunityDetail.vue';
import CommunityEdit from '@/components/community/CommunityEdit.vue';
import CommunityWrite from '@/components/community/CommunityWrite.vue';
import { onMounted, watch } from 'vue';

const store = usecommunityStore();

onMounted(() => {
  store.loadPosts(); // 게시글 목록 불러오기
});

watch(
  () => store.viewMode,
  (newVal) => {
    if (newVal === 'detail') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
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
  </div>
</template>

<style scoped>
.community-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
