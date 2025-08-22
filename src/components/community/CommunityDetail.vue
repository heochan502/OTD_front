<!-- src/components/community/CommunityDetail.vue -->
<script setup>
import { usecommunityStore } from '@/stores/communityStore';
import { useAccountStore } from '@/stores/counter';
import { ref, computed, watch, onMounted } from 'vue';
import MentForm from './MentForm.vue';
import {
  deletePost,
  toggleLike,
  fetchPostById,
  fetchPostImages, // [ADDED] 다중 이미지 조회
} from '@/services/community/communityService';

const store = usecommunityStore();
const account = useAccountStore();

const post = computed(() => store.selectedPost);
const isOwner = computed(
  () => Number(post.value?.memberNoLogin) === Number(account.loggedInId)
);

const isLiked = ref(false);
const likeCount = ref(0);

// [ADDED] 상세 이미지 상태
const images = ref([]);           // [{filePath, fileName?}, ...]
const carouselIndex = ref(0);
const hasImages = computed(() => (images.value?.length || 0) > 0);

// 이미지 목록 로드
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
    images.value = post.value?.filePath ? [{ filePath: post.value.filePath }] : [];
  }
};

watch(
  () => post.value,
  async (newVal) => {
    if (newVal) {
      likeCount.value = newVal.like;
      isLiked.value = newVal.likedByCurrentUser;
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
  const confirmed = confirm('해당 글을 삭제하시겠습니까?');
  if (!confirmed) return;
  try {
    await deletePost(post.value.postId);
    store.clearSelectedPost();
    alert('삭제 완료');
    await store.loadPosts();
    store.goList();
  } catch (err) {
    console.error('삭제 실패:', err);
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
  }
};
</script>

<template v-if="post">
  <v-container class="pa-6" fluid>
    <v-btn @click="store.goList()" variant="text" color="primary" class="mb-4">
      ← 목록으로
    </v-btn>

    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <!-- 이미지 캐러셀 (인디케이터 제거) -->
      <div class="px-4 pt-4">
        <v-card variant="tonal" rounded="lg" class="overflow-hidden">
          <template v-if="hasImages">
            <v-carousel
              v-model="carouselIndex"
              height="360"
              show-arrows="hover"
            >
              <v-carousel-item
                v-for="(img, i) in images"
                :key="i"
              >
                <v-img
                  :src="img.filePath || img.url"
                  aspect-ratio="16/9"
                  min-height="240"
                  cover
                />
              </v-carousel-item>
            </v-carousel>
          </template>

          <!-- 첨부가 전혀 없는 경우 -->
          <template v-else>
            <v-img
              :src="post.filePath"
              aspect-ratio="16/9"
              min-height="240"
              cover
            />
          </template>
        </v-card>
      </div>

      <v-card-text>
        <h2 class="mt-4 mb-4 font-weight-bold text-h5">{{ post.title }}</h2>
        <div class="d-flex align-center mb-4 text-grey text-body-2">
          <span class="mr-4">{{ post.memberNick }}</span>
          <span class="mr-4">{{ new Date(post.createdAt).toLocaleString() }}</span>
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

        <!-- 댓글 -->
        <MentForm />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.like-section { padding-left: 4px; }
</style>
