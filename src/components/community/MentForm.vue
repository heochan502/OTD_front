<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAccountStore } from '@/stores/counter';
import { usecommunityStore } from '@/stores/communityStore';
import {
  fetchMents,
  createMent as apiCreateMent,
  deleteMent as apiDeleteMent,
} from '@/services/community/mentService';

const account = useAccountStore();
const store = usecommunityStore();

// ✅ 반응형으로 선택 게시글 추적 (기존: const post = store.selectedPost;)
const post = computed(() => store.selectedPost);

const ments = ref([]);
const newMent = ref('');
const loading = ref(false);
const err = ref('');

// 날짜 포맷
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

// ✅ 목록 로드 (postId 필요)
const loadMents = async () => {
  if (!post.value?.postId) return;
  err.value = '';
  try {
    const res = await fetchMents(post.value.postId);
    ments.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    err.value = '댓글 조회에 실패했습니다.';
    console.error('댓글 조회 실패:', e);
  }
};

// ✅ 등록 (세션 기반: memberNoLogin 안보내도 됨)
const submitMent = async () => {
  if (!newMent.value.trim() || !post.value?.postId) return;
  loading.value = true;
  err.value = '';
  try {
    await apiCreateMent({
      postId: post.value.postId,
      content: newMent.value.trim(),
    });
    newMent.value = '';
    await loadMents(); // 갱신
  } catch (e) {
    err.value =
      e?.response?.status === 401 ? '로그인이 필요합니다.' : '댓글 등록 실패';
    console.error('댓글 등록 실패:', e);
  } finally {
    loading.value = false;
  }
};

// ✅ 삭제
const onDeleteMent = async (commentId) => {
  const confirmed = confirm('댓글을 삭제하시겠습니까?');
  if (!confirmed) return;
  loading.value = true;
  err.value = '';
  try {
    await apiDeleteMent(commentId);
    await loadMents(); // 갱신
  } catch (e) {
    err.value = '댓글 삭제 실패';
    console.error('댓글 삭제 실패:', e);
  } finally {
    loading.value = false;
  }
};

// ✅ postId가 준비/변경될 때마다 자동 로딩
watch(
  () => post.value?.postId,
  (v) => v && loadMents(),
  { immediate: true }
);

onMounted(() => {
  if (post.value?.postId) loadMents();
});
</script>

<template>
  <div class="comment-section">
    <v-alert
      v-if="err"
      type="error"
      variant="tonal"
      class="mb-3"
      density="comfortable"
    >
      {{ err }}
    </v-alert>

    <div class="text-subtitle-2 font-weight-medium mb-3">
      댓글 {{ ments.length }}개
    </div>

    <v-list class="mb-4">
      <v-list-item v-for="ment in ments" :key="ment.commentId">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-avatar size="36" class="mr-2">
              <v-img v-if="ment.memberImg" :src="ment.memberImg" />
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
            <span class="text-subtitle-2 font-weight-medium">
              {{ ment.memberNick }}
            </span>
          </div>
          <span class="text-caption text-grey">{{ formatDate(ment.updatedAt) }}</span>
        </div>

        <div class="text-body-2 mt-1 pl-10 d-flex justify-space-between">
          <span style="white-space: pre-wrap">{{ ment.content }}</span>
          <v-btn
            v-if="ment.memberNoLogin === account.loggedInId"
            icon
            size="small"
            @click="onDeleteMent(ment.commentId)"
            :disabled="loading"
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
      :disabled="loading"
      append-inner-icon="mdi-send"
      @click:append-inner="submitMent"
      @keyup.enter="submitMent"
    />
  </div>
</template>

<style scoped>
.comment-section {
  padding-left: 2rem;
}
</style>
