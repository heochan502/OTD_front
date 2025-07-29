<!-- <script setup>
import { usecommunityStore } from '@/stores/communityStore';
import { useAccountStore } from '@/stores/counter';
import axios from 'axios';
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

const ments = ref([]); // ✅ 댓글 목록
const newMent = ref(''); // ✅ 작성 중인 댓글

// 날짜 포맷 함수
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

onMounted(async () => {
  if (post.value?.postId) {
    try {
      const res = await axios.get(
        `/api/OTD/community/comment/${post.value.postId}`
      );
      ments.value = res.data;
    } catch (err) {
      console.error('댓글 조회 실패:', err);
    }
  }
});

//댓글 등록하는 메서드
const submitMent = async () => {
  if (!newMent.value.trim()) return;

  const payload = {
    postId: post.value.postId,
    memberNoLogin: account.loggedInId,
    content: newMent.value,
  };

  try {
    await axios.post('/api/OTD/community/comment/create', payload);
    newMent.value = '';

    // 다시 댓글 목록 불러오기
    const res = await axios.get(
      `/api/OTD/community/comment/${post.value.postId}`
    );
    ments.value = res.data;
  } catch (err) {
    console.error('댓글 등록 실패:', err);
  }
};
</script>

<template>
  <v-container class="pa-6" fluid>
    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <v-card-text>
        <h2 class="mb-6 font-weight-bold text-h5">글쓰기</h2>

        <v-text-field
          v-model="title"
          label="제목"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          clearable
        />

        <v-textarea
          v-model="content"
          label="내용"
          variant="outlined"
          auto-grow
          rows="6"
          clearable
        />

        <div class="d-flex justify-end mt-6">
          <v-btn
            color="primary"
            variant="flat"
            class="mr-2"
            @click="submitPost"
          >
            등록
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="cancelWrite">
            취소
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style> -->
