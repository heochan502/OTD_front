<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';
import { formatDateTime } from '@/utils/MemoAndDiaryApi';

const memoList = ref([]);
const router = useRouter();

const fetchMemoList = async () => {
  try {
    const result = await MemoHttpService.findAll({
      currentPage: 1,  // 페이지 번호 (필요에 따라 추가)
      pageSize: 10,    // 페이지 크기 (필요에 따라 추가)
    });
    memoList.value = result.memos;
    console.log("메모리스트 벨류 ", memoList.value);
    console.log("메모리스트 벨류 ", result);
  } catch (e) {
    alert('메모 목록 로딩 실패');
    console.error(e);
  }
};

const goToMemoDetail = (id) => {
  router.push(`/memoAndDiary/memo/${id}`); // 해당 메모 상세 페이지로 이동
};

onMounted(async () => {
  await fetchMemoList();  // 메모 목록을 가져옴
});
</script>

<template>
  <div class="memo-list-wrapper">
    <h2>메모 목록</h2>
    <div v-if="memoList.value===null" class="empty-message">
      등록된 메모가 없습니다.
    </div>
    <ul v-else>
      <li
        v-for="item in memoList"
        :key="item.id"
        class="memo-item"
        @click="goToMemoDetail(item.id)"
      >
        <div class="memo-title">{{ item.memoName }}</div>
        <div class="memo-content">{{ item.memoContent }}</div>
        <div class="memo-date">{{ formatDateTime(item.createdAt) }}</div>
      </li>
    </ul>
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
.diary-title, .diary-content, .diary-date {
  color: black !important;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>