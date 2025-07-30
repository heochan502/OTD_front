<script setup>
import { ref, onMounted } from 'vue';
import MemoHttpService from '@/services/memo/MemoHttpService';

const memos = ref([]);

const fetchMemos = async () => {
  try {
    const params = { currentPage: 1, pageSize: 100 };
    const result = await MemoHttpService.findAll(params);
    memos.value = result.memoList || [];
  } catch (e) {
    console.log('메모 목록 조회 중 오류가 발생했습니다.');
    console.error(e);
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

onMounted(fetchMemos);
defineExpose({ fetchMemos });

</script>

<template>
  <div class="memo-list">
    <div
      v-for="memo in memos"
      :key="memo.id"
      class="memo-item"
      @click="$emit('select', memo)"
    >
      <h3>{{ memo.memoName }}</h3>
      <p>{{ memo.memoContent }}</p>
      <span class="date">{{ formatDate(memo.createdAt) }}</span>
      <img
        v-if="memo.imageFileName"
        :src="`/pic/${memo.imageFileName}`"
        class="preview-image"
        alt="memo"
      />
    </div>

    <div v-if="memos.length === 0" class="empty-message">
      등록된 메모가 없습니다.
    </div>
  </div>
</template>

<style scoped>
.memo-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.memo-item {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.preview-image {
  margin-top: 12px;
  max-width: 200px;
  border-radius: 8px;
}
.date {
  font-size: 0.9rem;
  color: #888;
}
.empty-message {
  text-align: center;
  color: #999;
  margin-top: 20px;
}
</style>