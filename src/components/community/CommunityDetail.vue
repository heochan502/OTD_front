<script setup>
import { usecommunityStore } from '@/stores/communityStore';
import { useAccountStore } from '@/stores/counter';
import { ref, computed, onMounted } from 'vue';
import {
  deletePost,
  toggleLike,
  fetchPostById,
} from '@/services/community/communityService';

const store = usecommunityStore();
const account = useAccountStore();

const post = computed(() => store.selectedPost);
const isOwner = computed(
  () => Number(post.value?.memberNoLogin) === Number(account.loggedInId)
);

const isLiked = ref(false);
const likeCount = ref(0);

// 마운트될 때 서버에서 받은 post 기반으로 초기화
onMounted(() => {
  if (post.value) {
    likeCount.value = post.value.like || 0;
    isLiked.value = !!post.value.likedByCurrentUser; // ← 서버가 true/false 내려줘야 함
  }
});

const onEdit = () => {
  store.goEdit();
};

const onDelete = async () => {
  if (!post.value?.postId) return;
  const confirmed = window.confirm('해당 글을 삭제하시겠습니까?');
  if (!confirmed) return;

  try {
    await deletePost(post.value.postId);
    alert('삭제가 완료되었습니다.');
    await store.loadPosts();
    store.goList();
  } catch (err) {
    console.error('삭제 실패:', err);
    alert('삭제 중 오류가 발생했습니다.');
  }
};

const onToggleLike = async () => {
  try {
    await toggleLike(post.value.postId);

    const res = await fetchPostById(post.value.postId);
    const updatedPost = res.data;

    // store 갱신
    store.replacePost(updatedPost);
    store.selectPost(updatedPost);

    // UI 상태 갱신
    likeCount.value = updatedPost.like;
    isLiked.value = updatedPost.likedByCurrentUser; //
  } catch (err) {
    console.error('좋아요 토글 실패:', err);
  }
};

const dummyMents = ref([
  { nickname: '대구 티타늄', time: '3분 전', text: '굶으세요' },
  { nickname: '수빈잉', time: '15분 전', text: '맛있는 거 먹자!' },
]);
</script>

<template v-if="post">
  <v-container class="pa-6" fluid>
    <v-btn @click="store.goList()" variant="text" color="primary" class="mb-4"
      >← 목록으로</v-btn
    >

    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <v-card-text>
        <h2 class="mt-2 mb-4 font-weight-bold text-h5">{{ post.title }}</h2>

        <div class="d-flex align-center mb-4 text-grey text-body-2">
          <span class="mr-4">{{ post.nickname }}</span>
          <span class="mr-4">2025-08-01</span>
          <span>조회수 130회</span>
        </div>

        <div class="text-body-1 mb-6" style="white-space: pre-line">
          {{ post.content }}
        </div>

        <!-- 좋아요 버튼 -->
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

        <div class="comment-section">
          <div class="text-subtitle-2 font-weight-medium mb-3">
            댓글 {{ dummyMents.length }}개
          </div>

          <v-list class="mb-4">
            <v-list-item v-for="(ment, idx) in dummyMents" :key="idx">
              <div
                class="d-flex align-center justify-space-between"
                style="width: 100%"
              >
                <div class="d-flex align-center">
                  <v-avatar size="36" class="mr-2">
                    <v-icon>mdi-account-circle</v-icon>
                  </v-avatar>
                  <span class="text-subtitle-2 font-weight-medium">{{
                    ment.nickname
                  }}</span>
                </div>
                <span class="text-caption text-grey">{{ ment.time }}</span>
              </div>
              <div class="text-body-2 mt-1 pl-10">{{ ment.text }}</div>
            </v-list-item>
          </v-list>

          <v-text-field
            placeholder="댓글을 입력하세요"
            variant="outlined"
            density="comfortable"
            rounded
            append-inner-icon="mdi-send"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-list-item {
  align-items: flex-start;
  padding-top: 12px;
  padding-bottom: 12px;
}
.comment-section {
  padding-left: 2rem;
}
.like-section {
  padding-left: 4px;
}
</style>
