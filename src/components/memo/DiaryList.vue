<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DiaryHttpService from '@/services/memo/DiaryHttpService';
import { useAccountStore } from '@/stores/counter';
import { formatDateTime } from '@/utils/MemoAndDiaryApi';

const diaryList = ref([]);
const router = useRouter();
const accountStore = useAccountStore();

const fetchDiaryList = async () => {
  try {
    const params = {
      memberNoLogin: accountStore.state.memberNoLogin,
      currentPage: 1,
      pageSize: 10,
      offset: 0,
    };
    diaryList.value = await DiaryHttpService.findAll(params);
  } catch (error) {
    console.error('📔 다이어리 목록 로딩 실패:', error);
    alert('다이어리 목록을 불러오지 못했습니다.');
  }
};

const goToDiaryDetail = (id) => {
  router.push(`/memoAndDiary/diary/${id}`);
};

onMounted(fetchDiaryList);
</script>

<template>
  <div class="list-container">
    <h2>📔 다이어리 목록</h2>
    <div v-if="diaryList.length === 0" class="empty-message">
      등록된 다이어리가 없습니다.
    </div>
    <ul v-else class="list-wrapper">
      <li
        v-for="item in diaryList"
        :key="item.id"
        class="list-item"
        @click="goToDiaryDetail(item.id)"
      >
        <div class="title">{{ item.diaryName }}</div>
        <div class="content">{{ item.diaryContent }}</div>
        <div class="date">{{ formatDateTime(item.createdAt ?? item.created_at) }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.list-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  color: #000;
}

h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.list-wrapper {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 16px;
  margin-bottom: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.list-item:hover {
  background-color: #f0f0f0;
}

.title {
  font-weight: bold;
  font-size: 1.2rem;
}

.content {
  margin-top: 6px;
  color: #444;
}

.date {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #888;
  text-align: right;
}

.empty-message {
  color: #777;
  text-align: center;
  padding: 40px;
}
</style>