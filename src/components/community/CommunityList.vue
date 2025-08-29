<script setup>
import { ref, computed, onMounted } from 'vue';
import { usecommunityStore } from '@/stores/community/communityStore';

const store = usecommunityStore();

const itemsPerPage = 10;
const currentPage = ref(1);

onMounted(() => {
  store.loadPosts();
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
      <v-row align="center" no-gutters class="mb-3 search-row">
        <v-col cols="9" class="search-col">
          <v-text-field
            v-model="store.search"
            placeholder="검색어를 입력해 주세요"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            rounded
            class="search-input"
          />
        </v-col>
        <v-col cols="3" class="text-right ps-2 write-col">
          <v-btn
            color="#3bbeff"
            style="color: white"
            rounded
            height="40"
            class="write-btn"
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
        class="mb-4 sort-toggle"
      >
        <v-btn value="latest">최신순</v-btn>
        <v-btn value="like">인기순</v-btn>
      </v-btn-toggle>

      <v-card
        v-for="post in currentPagePosts"
        :key="post.postId"
        class="mb-2 px-3 py-3 hover-effect list-card"
        elevation="0"
        rounded="xl"
        style="border: 1px solid #e0e0e0"
        @click="handlePostClick(post)"
        v-ripple
      >
        <v-row no-gutters align="start" class="card-row">
          <v-col :cols="post.filePath ? 8 : 12" class="text-col">
            <div class="content-box">
              <div class="d-flex align-start">
                <v-avatar size="36" class="me-3 avatar" color="grey-lighten-2">
                  <v-icon icon="mdi-account" size="20" />
                </v-avatar>
                <div class="w-100">
                  <div class="text-caption text-grey-darken-1 meta-top">
                    {{ post.memberNick }} · {{ formatDate(post.createdAt) }}
                  </div>
                  <div class="text-body-1 font-weight-medium line-2 title">
                    {{ post?.title }}
                  </div>
                  <div class="text-caption text-grey mt-1 meta-bottom">
                    ❤️ {{ post.like }} · 💬 {{ post.commentCount }} · 👁️
                    {{ post.viewCount }}
                  </div>
                </div>
              </div>
            </div>
          </v-col>

          <v-col v-if="post.filePath" cols="4" sm="3" md="3" class="thumb-col">
            <v-img :src="post.filePath" class="thumb rounded-lg" cover>
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
              <template #error>
                <div
                  class="thumb-fallback d-flex align-center justify-center rounded-lg"
                >
                  <v-icon size="24" icon="mdi-image-off-outline" />
                </div>
              </template>
            </v-img>
          </v-col>
        </v-row>
      </v-card>

      <v-row justify="center" class="mt-5 pager-row">
        <v-pagination
          v-model="currentPage"
          :length="Math.ceil(totalCount / 10)"
          rounded
          color="primary"
          density="compact"
          @update:model-value="onPageChange"
          class="pager"
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
  transition: background-color 0.15s ease;
  cursor: pointer;
}
.hover-effect:hover {
  background-color: rgba(100, 100, 100, 0.06);
}

.card-row {
  --thumb-h: 90px;
  min-height: var(--thumb-h);
}
.content-box {
}
.thumb {
  width: 100%;
  height: var(--thumb-h);
  overflow: hidden;
}
.thumb-fallback {
  width: 100%;
  height: var(--thumb-h);
  background: rgba(160, 160, 160, 0.15);
}

.title {
  font-weight: 600;
  line-height: 1.3;
}
.meta-top,
.meta-bottom {
  color: #6b7280;
}

.line-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 990px 이하: 모바일 UI 최적화 (오른쪽 썸네일 유지) */
@media (max-width: 990px) {
  .list-wrap {
    max-width: 100%;
    padding: 0 12px;
  }

  .search-row {
    row-gap: 8px;
  }
  .search-col,
  .write-col {
    width: 100% !important;
    flex: 0 0 100% !important;
  }
  .write-col {
    padding-left: 0 !important;
  }
  .write-btn {
    width: 100%;
    height: 38px !important;
    border-radius: 12px;
  }
  .search-input :deep(.v-field__input) {
    padding-top: 9px;
    padding-bottom: 9px;
  }

  .sort-toggle {
    display: flex;
    justify-content: flex-start;
  }
  .sort-toggle :deep(.v-btn) {
    min-width: 0;
    padding: 0 12px;
    height: 32px;
  }

  .list-card {
    padding: 10px 10px !important;
    border-radius: 14px;
  }
  .card-row {
    --thumb-h: 74px;
    flex-direction: row;
    align-items: flex-start;
  }
  .text-col {
    flex: 0 0 70%;
    max-width: 70%;
  }
  .thumb-col {
    flex: 0 0 30%;
    max-width: 30%;
    padding-left: 8px !important;
    margin-top: 0;
  }

  .avatar {
    width: 32px !important;
    height: 32px !important;
  }
  .title {
    font-size: 0.95rem;
  }
  .meta-top,
  .meta-bottom {
    font-size: 0.8rem;
  }

  .thumb {
    height: var(--thumb-h);
    border-radius: 10px;
  }

  .pager-row {
    margin-top: 14px !important;
  }
  .pager :deep(.v-pagination__list) {
    gap: 2px;
  }
  .pager :deep(.v-btn) {
    height: 30px;
    min-width: 30px;
  }
}
</style>
