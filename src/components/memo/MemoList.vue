<script setup>
import { ref, onMounted } from 'vue';
import { useAccountStore } from '@/stores/counter';
import MemoHttpService from '@/services/memo/MemoHttpService';

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
  <div class="memo-list-wrapper">
    <div
      v-for="memo in memoList"
      :key="memo.memoId"
      class="memo-list-item"
      @click="$emit('select', memo)"
    >
      <div class="memo-list-text">
        <h3 class="memo-list-title">{{ memo.memoName }}</h3>
        <p class="memo-list-content">{{ memo.memoContent }}</p>
        <span class="memo-list-date">{{ formatDate(memo.createdAt) }}</span>
      </div>
      <img
        v-if="memo.memoImage"
        :src="`/pic/${memo.memoImage}`"
        class="memo-list-image"
        alt="memo"
        @error="e => e.target.style.display = 'none'"
      />
    </div>

    <div v-if="memoList.length === 0" class="memo-list-empty">
      등록된 메모가 없습니다.
    </div>
  </div>
</template>

<style scoped>
.memo-list-wrapper {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  color: #000;
}

.memo-list-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.memo-list-item:hover {
  background-color: #f0f0f0;
}

.memo-list-text {
  flex: 1;
}

.memo-list-title {
  font-size: 1.3rem;
  margin-bottom: 8px;
  font-weight: bold;
}

.memo-list-content {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #333;
}

.memo-list-date {
  font-size: 0.9rem;
  color: #888;
}

.memo-list-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 24px;
}

.memo-list-empty {
  text-align: center;
  color: #999;
  margin-top: 20px;
  font-style: italic;
}

/* 📱 모바일 반응형 */
@media (max-width: 768px) {
  .memo-list-wrapper {
    padding: 16px;
  }

  .memo-list-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .memo-list-image {
    width: 100%;
    height: auto;
    margin-left: 0;
    margin-top: 12px;
  }
}
</style>