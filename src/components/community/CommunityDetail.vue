<script setup>
import { usecommunityStore } from '@/stores/communityStore';
import { useAccountStore } from '@/stores/counter';
import axios from 'axios';
import { ref, computed, onMounted, watch } from 'vue';
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
const ments = ref([]);
const newMent = ref('');

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

const fetchMents = async () => {
  if (!post.value?.postId) return;
  try {
    const res = await axios.get(
      `/api/OTD/community/comment/${post.value.postId}`
    );
    ments.value = res.data;
  } catch (err) {
    console.error('댓글 조회 실패:', err);
  }
};

watch(
  () => post.value,
  (newVal) => {
    if (newVal) {
      likeCount.value = newVal.like;
      isLiked.value = newVal.likedByCurrentUser;
    }
  },
  { immediate: true } // 진입 즉시 실행되도록
);

// const submitMent = async () => {
//   if (!newMent.value.trim()) return;
//   try {
//     const payload = {
//       postId: post.value.postId,
//       memberNoLogin: account.loggedInId,
//       content: newMent.value,
//     };

//     console.log('📨 댓글 등록 시도:', payload);
//     await axios.post('/community/write', payload);

//     newMent.value = '';
//     await fetchMents(); // 댓글 한 번만 새로고침
//   } catch (err) {
//     console.error('❌ 댓글 등록 실패:', err);
//   }
// };

const deleteMent = async (commentId) => {
  try {
    const confirmed = confirm('댓글을 삭제하시겠습니까?');
    if (!confirmed) return;
    await axios.delete(`/api/OTD/community/comment/delete/${commentId}`);
    await fetchMents();
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
  }
};

const onEdit = () => store.goEdit();

const onDelete = async () => {
  if (!post.value?.postId) return;
  const confirmed = confirm('해당 글을 삭제하시겠습니까?');
  if (!confirmed) return;
  try {
    await deletePost(post.value.postId);
    store.clearSelectedPost(); // 선택된 게시글 초기화
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
    <v-btn @click="store.goList()" variant="text" color="primary" class="mb-4"
      >← 목록으로</v-btn
    >
    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <v-card-text>
        <h2 class="mt-2 mb-4 font-weight-bold text-h5">{{ post.title }}</h2>
        <div class="d-flex align-center mb-4 text-grey text-body-2">
          <span class="mr-4">{{ post.memberNick }}</span>
          <span class="mr-4">{{ formatDate(post.createdAt) }}</span>
          <span>조회수 {{ post.viewCount }}회</span>
        </div>

        <div class="text-body-1 mb-6" style="white-space: pre-line">
          {{ post.content }}
        </div>

        <!-- 좋아요 -->
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

        <!-- 수정/삭제 -->
        <div class="d-flex justify-end mb-4" v-if="isOwner">
          <v-btn variant="text" color="blue" @click="onEdit">수정하기</v-btn>
          <v-btn variant="text" color="red" @click="onDelete">삭제하기</v-btn>
        </div>

        <v-divider class="my-6" />

        <!-- 댓글 -->
        <div class="comment-section">
          <div class="text-subtitle-2 font-weight-medium mb-3">
            <!-- 댓글 {{ ments.length }}개 -->
            댓글 {{ 0 }}개
          </div>
          <v-list class="mb-4">
            <!-- <v-list-item v-for="ment in ments" :key="ment.commentId">
              <divgoDetail 
                class="d-flex align-center justify-space-between"
                style="width: 100%"
              >
                <div class="d-flex align-center">
                  <v-avatar size="36" class="mr-2">
                    <v-img :src="ment.memberImg || ''" v-if="ment.memberImg" />
                    <v-icon v-else>mdi-account-circle</v-icon>
                  </v-avatar>
                  <span class="text-subtitle-2 font-weight-medium">{{
                    ment.memberNick
                  }}</span>
                </div>
                <span class="text-caption text-grey">{{
                  formatDate(ment.updatedAt)
                }}</span>
              </div>
              <div class="text-body-2 mt-1 pl-10 d-flex justify-space-between">
                <span>{{ ment.content }}</span>
                <v-btn
                  v-if="ment.memberNoLogin === account.loggedInId"
                  icon
                  size="small"
                  @click="deleteMent(ment.commentId)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-list-item> -->
          </v-list>

          <v-text-field
            v-model="newMent"
            placeholder="댓글을 입력하세요"
            variant="outlined"
            density="comfortable"
            rounded
            append-inner-icon="mdi-send"
            @click:append-inner="submitMent"
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
