<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useDialogStore } from '@/stores/community/dialogStore';
import { useAccountStore } from '@/stores/counter';
import { usecommunityStore } from '@/stores/community/communityStore';
import {
  fetchMents,
  createMent as apiCreateMent,
  deleteMent as apiDeleteMent,
} from '@/services/community/mentService';

const dialog = useDialogStore();
const account = useAccountStore();
const store = usecommunityStore();

const post = computed(() => store.selectedPost);

const ments = ref([]);
const newMent = ref('');
const loading = ref(false);

// 날짜 포맷
function formatDate(dateStr) {
  const hasTz = /Z$|[+-]\d{2}:\d{2}$/.test(dateStr);
  const iso = hasTz ? dateStr : dateStr.replace(' ', 'T') + '+09:00';
  const d = new Date(iso);
  if (isNaN(d)) return '날짜 오류';
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 목록 로드
const loadMents = async () => {
  if (!post.value?.postId) return;
  try {
    const res = await fetchMents(post.value.postId);
    ments.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    console.error('댓글 조회 실패:', e);
    await dialog.alert({ title: '오류', message: '댓글 조회에 실패했습니다.' });
  }
};

// 등록
const submitMent = async () => {
  if (!newMent.value.trim() || !post.value?.postId) return;
  loading.value = true;
  try {
    await apiCreateMent({
      postId: post.value.postId,
      content: newMent.value.trim(),
    });
    newMent.value = '';
    await loadMents();
  } catch (e) {
    console.error('댓글 등록 실패:', e);
    const msg =
      e?.response?.status === 401
        ? '로그인이 필요합니다.'
        : '댓글 등록에 실패했습니다.';
    await dialog.alert({ title: '오류', message: msg });
  } finally {
    loading.value = false;
  }
};

// 삭제
const onDeleteMent = async (commentId) => {
  const ok = await dialog.confirm({
    title: '삭제 확인',
    message: '댓글을 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
  });
  if (!ok) return;
  loading.value = true;
  try {
    await apiDeleteMent(commentId);
    await loadMents();
  } catch (e) {
    console.error('댓글 삭제 실패:', e);
    await dialog.alert({ title: '오류', message: '댓글 삭제에 실패했습니다.' });
  } finally {
    loading.value = false;
  }
};

// postId 변경 시 자동 로딩
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
          <span class="text-caption text-grey">{{
            formatDate(ment.updatedAt)
          }}</span>
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
