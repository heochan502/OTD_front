<script setup>
import { ref, onMounted } from 'vue';
import { useAccountStore } from '@/stores/counter';
import { usecommunityStore } from '@/stores/communityStore';
import axios from 'axios';

const account = useAccountStore();
const store = usecommunityStore();
const post = store.selectedPost;

const ments = ref([]);
const newMent = ref('');

const fetchMents = async () => {
  if (!post?.postId) return;
  try {
    const res = await axios.get(`/api/OTD/community/comment/${post.postId}`);
    ments.value = res.data;
  } catch (err) {
    console.error('댓글 조회 실패:', err);
  }
};

const submitMent = async () => {
  if (!newMent.value.trim()) return;

  const payload = {
    postId: post.postId,
    memberNoLogin: account.loggedInId,
    content: newMent.value,
  };

  console.log('댓글 등록 시도:', payload);

  try {
    await axios.post('/api/OTD/community/comment/create', payload);
    newMent.value = '';
    await fetchMents();
  } catch (err) {
    console.error('댓글 등록 실패:', err);
  }
};

const deleteMent = async (commentId) => {
  const confirmed = confirm('댓글을 삭제하시겠습니까?');
  if (!confirmed) return;
  try {
    await axios.delete(`/api/OTD/community/comment/delete/${commentId}`);
    await fetchMents();
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
  }
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

onMounted(fetchMents);
</script>

<template>
  <div class="comment-section">
    <div class="text-subtitle-2 font-weight-medium mb-3">
      댓글 {{ ments.length }}개
    </div>
    <v-list class="mb-4">
      <v-list-item v-for="ment in ments" :key="ment.commentId">
        <div class="d-flex align-center justify-space-between w-100">
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
      </v-list-item>
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
</template>

<style scoped>
.comment-section {
  padding-left: 2rem;
}
</style>
