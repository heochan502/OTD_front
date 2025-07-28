<script setup>
import { ref, onMounted, computed } from 'vue';
import MemoHttpService from '@/services/memo/MemoHttpService';

const memos = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const totalMemos = ref(0);

const totalPages = computed(() => Math.ceil(totalMemos.value / pageSize));

const fetchMemos = async (page = 1) => {
  try {
    const params = { currentPage: page, pageSize };
    const result = await MemoHttpService.findAll(params);
    memos.value = result.memoList || [];
    totalMemos.value = result.totalCount || 0;
    currentPage.value = page;
  } catch (err) {
    alert('메모 리스트를 불러오는데 실패했습니다.');
  }
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  fetchMemos(page);
};

const goToDetail = (id) => {
  // 라우터를 이용해 메모 상세 페이지로 이동
  window.location.href = `/memoAndDiary/memo/${id}`; // 혹은 router.push() 사용 가능
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const dt = new Date(dateString);
  return dt.toLocaleString();
};

onMounted(() => {
  fetchMemos();
});
</script>

<template>
  <div class="memo-list">
    <h2>메모 리스트</h2>
    <ul>
      <li v-for="memo in memos" :key="memo.id" @click="goToDetail(memo.id)">
        <h3>{{ memo.memoName }}</h3>
        <p>{{ memo.memoContent }}</p>
        <img v-if="memo.memoImageFileName" :src="`/pic/${memo.memoImageFileName}`" alt="memo image" width="100" />
        <small>{{ formatDateTime(memo.createdAt) }}</small>
      </li>
    </ul>

    <div class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<style scoped>
.memo-list {
  max-width: 600px;
  margin: 0 auto;
}
.memo-list ul {
  list-style: none;
  padding: 0;
}
.memo-list li {
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.memo-list img {
  display: block;
  margin-top: 0.5rem;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>