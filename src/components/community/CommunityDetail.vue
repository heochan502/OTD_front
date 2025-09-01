<script setup>
import { usecommunityStore } from '@/stores/community/communityStore';
import { useDialogStore } from '@/stores/community/dialogStore';
import { useAccountStore } from '@/stores/counter';
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import MentForm from './MentForm.vue';
import {
  deletePost,
  toggleLike,
  fetchPostById,
  fetchPostImages,
} from '@/services/community/communityService';

const store = usecommunityStore();
const dialog = useDialogStore();
const account = useAccountStore();

const post = computed(() => store.selectedPost);
const isOwner = computed(
  () => Number(post.value?.memberNoLogin) === Number(account.loggedInId)
);

const isLiked = ref(false);
const likeCount = ref(0);

const images = ref([]);
const carouselIndex = ref(0);
const hasImages = computed(() => (images.value?.length || 0) > 0);

const loadImages = async () => {
  if (!post.value?.postId) {
    images.value = [];
    return;
  }
  try {
    const { data } = await fetchPostImages(post.value.postId);
    images.value = Array.isArray(data) ? data : [];
    if (!images.value.length && post.value.filePath) {
      images.value = [{ filePath: post.value.filePath }];
    }
    carouselIndex.value = 0;
  } catch {
    images.value = post.value?.filePath
      ? [{ filePath: post.value.filePath }]
      : [];
  }
};

watch(
  () => post.value,
  async (v) => {
    if (v) {
      likeCount.value = v.like;
      isLiked.value = v.likedByCurrentUser;
      await loadImages();
    } else {
      images.value = [];
    }
  },
  { immediate: true }
);

onMounted(loadImages);

const onEdit = () => store.goEdit();
const onDelete = async () => {
  if (!post.value?.postId) return;
  const ok = await dialog.confirm({
    title: '삭제 확인',
    message: '해당 글을 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
  });
  if (!ok) return;
  try {
    await deletePost(post.value.postId);
    store.clearSelectedPost();
    await dialog.alert({ title: '완료', message: '삭제되었습니다.' });
    await store.loadPosts();
    store.goList();
  } catch {
    await dialog.alert({
      title: '오류',
      message: '삭제 중 문제가 발생했습니다.',
    });
  }
};

const onToggleLike = async () => {
  try {
    await toggleLike(post.value.postId);
    const res = await fetchPostById(post.value.postId);
    const updatedPost = res.data;
    store.replacePost(updatedPost);
    store.selectPost(updatedPost);
    likeCount.value = updatedPost.like;
    isLiked.value = updatedPost.likedByCurrentUser;
  } catch {
    await dialog.alert({
      title: '오류',
      message: '좋아요 처리 중 문제가 발생했습니다.',
    });
  }
};

/* ===== 480px 이하에서 캐러셀 높이 300 고정 ===== */
const vw = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
const onResize = () => {
  vw.value = window.innerWidth;
};
const isXs = computed(() => vw.value <= 480);
const carouselHeight = computed(() => (isXs.value ? 300 : 500));

onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('orientationchange', onResize);
});

/* 썸네일 클릭 핸들러 */
const pick = (i) => {
  carouselIndex.value = i;
};
</script>

<template v-if="post">
  <v-container class="pa-6 detail-container" fluid>
    <v-btn
      @click="store.goList()"
      variant="text"
      color="primary"
      class="mb-4 back-btn"
    >
      ← 목록으로
    </v-btn>

    <v-card
      class="mx-auto detail-card"
      max-width="800"
      elevation="2"
      rounded="lg"
    >
      <div class="px-4 pt-4 media-wrap">
        <v-card variant="tonal" rounded="lg" class="overflow-hidden">
          <!-- 캐러셀 -->
          <template v-if="hasImages">
            <v-carousel
              v-model="carouselIndex"
              class="detail-carousel"
              :height="carouselHeight"
              :hide-delimiters="images.length <= 1 ? true : false"
              hide-delimiter-background
              show-arrows="always"
              cycle
              continuous
              touch
            >
              <v-carousel-item v-for="(img, i) in images" :key="`img-${i}`">
                <div class="slide-frame">
                  <v-img
                    :src="img.filePath || img.url"
                    cover
                    height="100%"
                    width="100%"
                  />
                </div>
              </v-carousel-item>
            </v-carousel>

            <!-- 썸네일 바 (탭 전환) -->
            <v-slide-group
              v-if="images.length > 1"
              class="thumb-strip"
              show-arrows
            >
              <v-slide-group-item
                v-for="(img, i) in images"
                :key="`thumb-${i}`"
                v-slot="{ isSelected, toggle }"
              >
                <v-sheet
                  class="thumb-item"
                  :elevation="isSelected ? 4 : 1"
                  rounded="md"
                  @click="
                    toggle();
                    pick(i);
                  "
                >
                  <v-img
                    :src="img.filePath || img.url"
                    width="64"
                    height="48"
                    cover
                  />
                </v-sheet>
              </v-slide-group-item>
            </v-slide-group>
          </template>

          <template v-else>
            <div class="slide-frame" :style="{ height: carouselHeight + 'px' }">
              <v-img :src="post.filePath" cover height="100%" width="100%" />
            </div>
          </template>
        </v-card>
      </div>

      <v-card-text class="detail-body">
        <h2 class="mt-4 mb-4 font-weight-bold detail-title text-h5">
          {{ post.title }}
        </h2>
        <div class="d-flex align-center mb-4 text-grey text-body-2 detail-meta">
          <span class="mr-4">{{ post.memberNick }}</span>
          <span class="mr-4">{{
            new Date(post.createdAt).toLocaleString()
          }}</span>
          <span>조회수 {{ post.viewCount }}회</span>
        </div>

        <div
          class="text-body-1 mb-6 detail-content"
          style="white-space: pre-line"
        >
          {{ post.content }}
        </div>

        <div class="d-flex align-center mb-4 like-section">
          <v-btn
            icon
            variant="plain"
            :color="isLiked ? 'red' : 'grey'"
            @click="onToggleLike"
          >
            <v-icon>{{ isLiked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
          </v-btn>
          <span class="ml-2 like-count">{{ likeCount }}</span>
        </div>

        <div class="d-flex justify-end mb-4 owner-wrap" v-if="isOwner">
          <v-btn variant="text" color="blue" class="owner-btn" @click="onEdit"
            >수정하기</v-btn
          >
          <v-btn variant="text" color="red" class="owner-btn" @click="onDelete"
            >삭제하기</v-btn
          >
        </div>

        <v-divider class="my-6" />
        <MentForm />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.like-section {
  padding-left: 4px;
}
.like-count {
  font-size: 0.95rem;
}

/* 캐러셀 프레임이 캐러셀 높이를 꽉 채우도록 */
.slide-frame {
  width: 100%;
  height: 100%;
}

/* 도트 배경 투명 */
.detail-carousel :deep(.v-carousel__controls) {
  background: transparent !important;
  box-shadow: none !important;
  padding-block: 4px !important;
}

/* 썸네일 스트립 */
.thumb-strip {
  padding: 8px 8px 12px;
  background: transparent;
}
.thumb-item {
  width: 72px;
  height: 52px;
  margin-right: 8px;
  overflow: hidden;
  cursor: pointer;
}

/* 반응형 */
@media (max-width: 990px) {
  .detail-container {
    padding: 16px !important;
  }
  .detail-card {
    max-width: 100% !important;
    border-radius: 14px;
  }
  .media-wrap {
    padding: 0 8px;
  }
  .detail-body {
    padding: 12px 16px 20px;
  }
  .detail-title {
    font-size: 1.1rem !important;
    line-height: 1.35;
    margin-bottom: 12px !important;
  }
  .detail-meta {
    font-size: 0.86rem !important;
    gap: 6px;
    flex-wrap: wrap;
  }
  .detail-content {
    font-size: 0.95rem;
  }
  .back-btn {
    padding-left: 0;
    min-height: 36px;
  }
  :deep(.v-btn--icon) {
    width: 40px;
    height: 40px;
  }
  .owner-wrap {
    gap: 6px;
  }
  .owner-btn {
    min-width: 0;
    padding: 0 8px;
  }
}

@media (max-width: 480px) {
  .detail-container {
    padding: 12px !important;
  }
  .detail-card {
    border-radius: 12px;
  }
  .detail-title {
    font-size: 1.06rem !important;
  }
  .detail-meta {
    font-size: 0.84rem !important;
  }
  .detail-content {
    font-size: 0.93rem;
  }
  :deep(.v-btn--icon) {
    width: 38px;
    height: 38px;
  }

  /* 모바일에서도 도트/화살표를 숨기지 않음 → 여러 장 여부를 시각적으로 확인 & 터치가 불안정해도 조작 가능 */
}
</style>
