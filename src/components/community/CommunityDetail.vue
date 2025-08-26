<script setup>
import { usecommunityStore } from '@/stores/community/communityStore';
import { useDialogStore } from '@/stores/community/dialogStore';
import { useAccountStore } from '@/stores/counter';
import { ref, computed, watch, onMounted } from 'vue';
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
    if (images.value.length === 0 && post.value.filePath) {
      images.value = [{ filePath: post.value.filePath }];
    }
    carouselIndex.value = 0;
  } catch (e) {
    console.error('이미지 조회 실패:', e);
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
  } catch (err) {
    console.error('삭제 실패:', err);
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
  } catch (err) {
    console.error('좋아요 토글 실패:', err);
    await dialog.alert({
      title: '오류',
      message: '좋아요 처리 중 문제가 발생했습니다.',
    });
  }
};
</script>

<template v-if="post">
  <v-container class="pa-6" fluid>
    <v-btn @click="store.goList()" variant="text" color="primary" class="mb-4">
      ← 목록으로
    </v-btn>

    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <div class="px-4 pt-4">
        <v-card variant="tonal" rounded="lg" class="overflow-hidden">
          <template v-if="hasImages">
            <!-- 정사각형에 가깝게 보이도록 커스텀 클래스 추가 -->
            <v-carousel
              v-model="carouselIndex"
              class="square-carousel"
              show-arrows="hover"
              :hide-delimiters="images.length <= 1"
            >
              <v-carousel-item v-for="(img, i) in images" :key="i">
                <!-- 정사각형 프레임 -->
                <div class="square-frame">
                  <v-img :src="img.filePath || img.url" cover height="100%">
                    <template #placeholder>
                      <div class="h-100 d-flex align-center justify-center">
                        <v-progress-circular
                          indeterminate
                          size="20"
                          width="2"
                        />
                      </div>
                    </template>
                    <template #error>
                      <div class="h-100 d-flex align-center justify-center">
                        <v-icon size="28">mdi-image-broken-variant</v-icon>
                      </div>
                    </template>
                  </v-img>
                </div>
              </v-carousel-item>
            </v-carousel>
          </template>

          <template v-else>
            <!-- 단일 대표 이미지도 정사각형 프레임 적용 -->
            <div class="square-frame">
              <v-img :src="post.filePath" cover height="100%" />
            </div>
          </template>
        </v-card>
      </div>

      <v-card-text>
        <!-- 이하 동일 -->
        <h2 class="mt-4 mb-4 font-weight-bold text-h5">{{ post.title }}</h2>
        <div class="d-flex align-center mb-4 text-grey text-body-2">
          <span class="mr-4">{{ post.memberNick }}</span>
          <span class="mr-4">{{
            new Date(post.createdAt).toLocaleString()
          }}</span>
          <span>조회수 {{ post.viewCount }}회</span>
        </div>

        <div class="text-body-1 mb-6" style="white-space: pre-line">
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
          <span class="ml-2">{{ likeCount }}</span>
        </div>

        <div class="d-flex justify-end mb-4" v-if="isOwner">
          <v-btn variant="text" color="blue" @click="onEdit">수정하기</v-btn>
          <v-btn variant="text" color="red" @click="onDelete">삭제하기</v-btn>
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

/* 정사각형 프레임: 가로에 맞춰 세로 자동 결정 */
.square-frame {
  width: 100%;
  aspect-ratio: 1 / 1;
}

/* Vuetify 캐러셀 기본 높이(고정)를 풀어주기 위한 최소 오버라이드 */
.square-carousel :deep(.v-window__container),
.square-carousel :deep(.v-window-item) {
  height: auto !important;
}
</style>
