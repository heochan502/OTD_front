<script setup>
import { ref, onMounted, computed } from 'vue';
import DiaryHttpService from '@/services/memo/DiaryHttpService';

const diaries = ref([]);
const currentPage = ref(1);
const pageSize = 5;
const totalDiaries = ref(0);

const totalPages = computed(() => Math.ceil(totalDiaries.value / pageSize));

const fetchDiaries = async (page = 1) => {
  try {
    const params = { currentPage: page, pageSize };
    const result = await DiaryHttpService.findAll(params);
    diaries.value = result.diaryList || [];
    totalDiaries.value = result.totalCount || 0;
    currentPage.value = page;
  } catch (err) {
    alert('다이어리 리스트를 불러오는데 실패했습니다.');
  }
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  fetchDiaries(page);
};

const goToDetail = (id) => {
  // 라우터를 이용해 다이어리 상세 페이지로 이동
  window.location.href = `/memoAndDiary/diary/${id}`; // 혹은 router.push() 사용 가능
};

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const dt = new Date(dateString);
  return dt.toLocaleString();
};

onMounted(() => {
  fetchDiaries();
});
</script>

<template>
  <div class="diary-list">
    <h2>다이어리 리스트</h2>
    <ul>
      <li v-for="diary in diaries" :key="diary.id" @click="goToDetail(diary.id)">
        <h3>{{ diary.diaryName }}</h3>
        <p>{{ diary.diaryContent }}</p>
        <img v-if="diary.diaryImageFileName" :src="`/pic/${diary.diaryImageFileName}`" alt="diary image" width="100" />
        <small>{{ formatDateTime(diary.createdAt) }}</small>
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
.diary-list {
  max-width: 600px;
  margin: 0 auto;
}
.diary-list ul {
  list-style: none;
  padding: 0;
}
.diary-list li {
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.diary-list img {
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