<script setup>
import { ref, onMounted } from 'vue';
import { useAccountStore } from '@/stores/counter';
import MemoHttpService from '@/services/memo/MemoHttpService';
import '@/components/memo/MemoAndDiaryDetail.css';

const memoList = ref([]);
const emit = defineEmits(['select']);
const accountStore = useAccountStore();

const fetchMemoList = async () => {
  console.log('[memoList] 로그인된 유저 ID:', accountStore.loggedInId);
  const params = {
    currentPage: 1,
    pageSize: 100,
    memberNoLogin: accountStore.loggedInId,
  };
  try {
    const result = await MemoHttpService.findAll(params);
    console.log('[memoList] 서버 응답:', result);
    memoList.value = result.memoList || result.memolist || [];
  } catch (e) {
    console.error('❌ 메모 목록 조회 중 오류:', e);
    memoList.value = [];
  }
};

onMounted(fetchMemoList);
defineExpose({ fetchMemoList });

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};
</script>

<template>
  <div class="memo-list">
    <div
      v-for="memo in memoList"
      :key="memo.id"
      class="memo-item"
      @click="$emit('select', memo)"
    >
      <h3>{{ memo.memoName }}</h3>
      <p>{{ memo.memoContent }}</p>
      <span class="date">{{ formatDate(memo.createdAt) }}</span>
      <img
        v-show="memo.memoImageFileName"
        :src="`/pic/${memo.memoImageFileName}`"
        class="preview-image"
        alt="memo"
      />
    </div>

    <div v-show="memoList.length === 0" class="empty-message">
      등록된 메모가 없습니다.
    </div>
  </div>
</template>