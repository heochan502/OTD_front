<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DiaryHttpService from '@/services/memo/DiaryHttpService';
import { formatDateTime } from '@/utils/MemoAndDiaryApi';

const diaryList = ref([]);
const router = useRouter();

const fetchDiaryList = async () => {
  try {
    const result = await DiaryHttpService.findAll({
      currentPage: 1,  // 페이지 번호 (필요에 따라 추가)
      pageSize: 10,    // 페이지 크기 (필요에 따라 추가)
    });
    diaryList.value = result.diaryList;
  } catch (e) {
    alert('다이어리 목록 로딩 실패');
    console.error(e);
  }
};

const goToDiaryDetail = (id) => {
  router.push(`/memoAndDiary/diary/${id}`); // 해당 다이어리 상세 페이지로 이동
};

onMounted(async () => {
  await fetchDiaryList();  // 다이어리 목록을 가져옴
});
</script>

<template>
  <div class="diary-list-wrapper">
    <h2>다이어리 목록</h2>
    <div v-if="diaryList.length === 0" class="empty-message">
      등록된 다이어리가 없습니다.
    </div>
    <ul v-else>
      <li
        v-for="item in diaryList"
        :key="item.id"
        class="diary-item"
        @click="goToDiaryDetail(item.id)"
      >
        <div class="diary-title">{{ item.diaryName }}</div>
        <div class="diary-content">{{ item.diaryContent }}</div>
        <div class="diary-date">{{ formatDateTime(item.createdAt) }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.diary-list-wrapper {
  padding: 20px;
}

.diary-item {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.diary-item:hover {
  background-color: #f9f9f9;
}

.empty-message {
  color: #888;
  text-align: center;
}
</style>