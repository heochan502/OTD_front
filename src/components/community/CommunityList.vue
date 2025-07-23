<script setup>
import { computed } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';

const store = usecommunityStore();

const filteredPosts = computed(() => {
  const query = store.search.trim().toLowerCase();
  if (!query) return store.sortedPosts;

  return store.sortedPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      post.nickname.toLowerCase().includes(query)
  );
});
</script>

<template>
  <v-container class="pa-6" fluid>
    <!-- ✅ 중앙 정렬된 콘텐츠 래퍼 -->
    <div class="list-wrap mx-auto">
      <v-row align="center" no-gutters class="mb-3">
        <v-col cols="9">
          <v-text-field
            v-model="store.search"
            placeholder="검색어를 입력해 주세요"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded
          />
        </v-col>
        <v-col cols="3" class="text-right ps-2">
          <v-btn color="primary" rounded height="40" @click="store.goWrite()"
            >글쓰기</v-btn
          >
        </v-col>
      </v-row>

      <v-btn-toggle
        v-model="store.sortOption"
        color="primary"
        rounded
        group
        class="mb-4"
      >
        <v-btn value="latest">최신순</v-btn>
        <v-btn value="likes">좋아요순</v-btn>
      </v-btn-toggle>

      <v-card
        v-for="(post, index) in filteredPosts"
        :key="index"
        class="mb-3 px-3 py-4 hover-effect"
        elevation="0"
        rounded="xl"
        style="border: 1px solid #e0e0e0"
        @click="store.goDetail(post)"
      >
        <v-row justify="space-between" no-gutters>
          <v-row align="start" no-gutters class="flex-grow-1">
            <v-avatar size="40" class="me-3" color="grey-lighten-2">
              <v-icon icon="mdi-account" />
            </v-avatar>
            <div>
              <div class="text-caption text-grey-darken-1">
                {{ post.nickname }} · {{ post.time }}
              </div>
              <div class="text-body-1 font-weight-medium">
                {{ post.title }}
              </div>
              <div class="text-caption text-grey mt-1">
                ❤️ {{ post.likes }} · 💬 {{ post.comments }}
              </div>
            </div>
          </v-row>
          <v-img
            :src="post.thumbnail || ''"
            width="60"
            height="60"
            cover
            rounded
            class="ms-3"
            :class="{ 'bg-grey-lighten-3': !post.thumbnail }"
          />
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.list-wrap {
  max-width: 800px;
  width: 100%;
}

.hover-effect {
  transition: background-color 0.2s ease;
  cursor: pointer;
}
.hover-effect:hover {
  background-color: rgba(100, 100, 100, 0.06);
}
</style>
