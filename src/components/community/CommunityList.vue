<script setup>
import { ref, computed, onMounted } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';

const store = usecommunityStore();

const itemsPerPage = 10;
const currentPage = ref(1);

onMounted(() => {

  store.loadPosts();
  console.log('store.posts:', store.posts);

});

const filteredPosts = computed(() => {
  const query = store.search.trim().toLowerCase();
  if (!query) return store.sortedPosts;

  return store.sortedPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      (post.memberNick || '').toLowerCase().includes(query)
  );
});


// 페이징 계산
const pageCount = computed(() =>
  Math.ceil(filteredPosts.value.length / itemsPerPage)
);

const currentPagePosts = computed(() => store.sortedPosts); // 이미 현재 페이지 10개

const onPageChange = (page) => {
  currentPage.value = page;
  store.loadPosts(page); //페이지 바뀔 때마다 새 게시글 요청
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return '날짜 오류';
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const handlePostClick = (post) => {
  console.log('클릭된 post:', post);
  if (!post?.postId || post.postId <= 0) {
    console.warn('유효하지 않은 postId:', post.postId);
    return;
  }
  store.goDetail(post);
};

</script>

<template>
  <v-container class="pa-6" fluid>
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
        <v-btn value="like">인기순</v-btn>
      </v-btn-toggle>

      <v-card
        v-for="post in currentPagePosts"
        :key="post.postId"
        class="mb-3 px-3 py-4 hover-effect"
        elevation="0"
        rounded="xl"
        style="border: 1px solid #e0e0e0"
        @click="handlePostClick(post)"
      >
        <v-row justify="space-between" no-gutters>
          <v-row align="start" no-gutters class="flex-grow-1">
            <v-avatar size="40" class="me-3" color="grey-lighten-2">
              <v-icon icon="mdi-account" />
            </v-avatar>
            <div>
              <div class="text-caption text-grey-darken-1">
                {{ post.memberNick }} ·
                {{ formatDate(post.createdAt) }}
              </div>
              <div class="text-body-1 font-weight-medium">
                {{ post?.title }}
              </div>
              <div class="text-caption text-grey mt-1">
                ❤️ {{ post.like }} · 💬 {{ post.commentCount }}· 👁️
                {{ post.viewCount }}
              </div>
            </div>
          </v-row>
        </v-row>
      </v-card>
      <!-- 페이지네이션 -->
      <v-row justify="center" class="mt-6">
        <v-pagination
          v-model="currentPage"
          :length="Math.ceil(totalCount / 10)"
          rounded
          color="primary"
          @update:model-value="onPageChange"
        />
      </v-row>
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
