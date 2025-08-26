<script setup>
import { ref, computed, onMounted } from 'vue';
import { usecommunityStore } from '@/stores/community/communityStore';

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

const pageCount = computed(() =>
  Math.ceil(filteredPosts.value.length / itemsPerPage)
);

// 이미 현재 페이지 10개를 store에서 제공한다고 가정
const currentPagePosts = computed(() => store.sortedPosts);

const onPageChange = (page) => {
  currentPage.value = page;
  store.loadPosts(page);
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
  if (!post?.postId || post.postId <= 0) return;
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
          <v-btn
            color="#3bbeff"
            style="color: white"
            rounded
            height="40"
            @click="store.goWrite()"
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
        <!-- [CHANGED] 카드 행 자체에 고정 높이 부여해서 균일화 -->
        <v-row no-gutters align="center" class="card-row">
          <!-- 텍스트 영역(왼쪽) -->
          <v-col :cols="post.filePath ? 8 : 12">
            <!-- [CHANGED] 높이 안에서 세로 가운데 정렬 -->
            <div class="content-box">
              <div class="d-flex align-start">
                <v-avatar size="40" class="me-3" color="grey-lighten-2">
                  <v-icon icon="mdi-account" />
                </v-avatar>
                <div class="w-100">
                  <div class="text-caption text-grey-darken-1">
                    {{ post.memberNick }} · {{ formatDate(post.createdAt) }}
                  </div>
                  <!-- [CHANGED] 두 줄까지만 보이고 넘치면 말줄임 -->
                  <div class="text-body-1 font-weight-medium line-2">
                    {{ post?.title }}
                  </div>
                  <div class="text-caption text-grey mt-1">
                    ❤️ {{ post.like }} · 💬 {{ post.commentCount }} · 👁️
                    {{ post.viewCount }}
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <!-- 썸네일(오른쪽) -->
          <v-col v-if="post.filePath" cols="4" sm="3" md="3" class="pl-3">
            <v-img :src="post.filePath" class="thumb rounded-lg" cover>
              <template #placeholder>
                <v-skeleton-loader type="image"></v-skeleton-loader>
              </template>
              <template #error>
                <div
                  class="thumb-fallback d-flex align-center justify-center rounded-lg"
                >
                  <v-icon size="28" icon="mdi-image-off-outline" />
                </div>
              </template>
            </v-img>
          </v-col>
        </v-row>
      </v-card>

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

/* [CHANGED] 카드 행 공통 높이(이미지 유무와 무관하게 동일) */
.card-row {
  --thumb-h: 104px; /* 필요 시 96~120px로 조절 */
  min-height: var(--thumb-h);
}

/* [CHANGED] 텍스트 영역을 행 높이에 맞춰 가운데 정렬 */
.content-box {
  min-height: var(--thumb-h);
  display: flex;
  align-items: center; /* 수직 가운데 */
}

/* 썸네일은 행 높이에 딱 맞춤 */
.thumb {
  width: 100%;
  height: var(--thumb-h);
  overflow: hidden;
}

/* 에러시 대체 박스 */
.thumb-fallback {
  width: 100%;
  height: var(--thumb-h);
  background: rgba(160, 160, 160, 0.15);
}

/* 두 줄 말줄임 처리 */
.line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
