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
<<<<<<< HEAD
    const result = await MemoHttpService.findAll(params);
    console.log('[memoList] 서버 응답:', result);
    memoList.value = result.memoList || result.memolist || [];
=======
    const result = await MemoHttpService.findAll({
      currentPage: 1,  // 페이지 번호 (필요에 따라 추가)
      pageSize: 10,    // 페이지 크기 (필요에 따라 추가)
    });
    memoList.value = result.memos;
    console.log("메모리스트 벨류 ", memoList.value);
    console.log("메모리스트 벨류 ", result);
>>>>>>> 49355e2c250da3a5bd6c85c90f3375c904d4870a
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
<<<<<<< HEAD
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
=======
  <div class="memo-list-wrapper">
    <h2>메모 목록</h2>
    <div v-if="memoList.value===null" class="empty-message">
>>>>>>> 49355e2c250da3a5bd6c85c90f3375c904d4870a
      등록된 메모가 없습니다.
    </div>
  </div>
</template>