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
      currentPage: 1,
      pageSize: 10,
    });
    memoList.value = result.memoList;
  } catch (e) {
    alert('메모 목록 로딩 실패');
    console.error(e);
  }
};

const goToMemoDetail = (id) => {
  router.push(`/memo/${id}`);
};

const goToAddMemo = () => {
  router.push('/memo/add');
};

onMounted(fetchMemoList);
</script>

<template>
  <div class="memo-list-wrapper">
    <h2>메모 목록</h2>

    <button @click="goToAddMemo" class="add-memo-button">+ 메모 등록</button>

    <div v-if="memoList.length === 0" class="empty-message">
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
        <img
          v-if="item.imageFileName"
          :src="`/pic/${item.imageFileName}`"
          alt="메모 이미지"
          class="memo-thumbnail"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.memo-list-wrapper {
  max-width: 600px;
  margin: 0 auto;
}
.add-memo-button {
  margin-bottom: 1rem;
  padding: 8px 16px;
  background-color: #50c3f7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.memo-item {
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
}
.memo-title,
.memo-content,
.memo-date {
  color: black;
  margin-bottom: 0.3rem;
}
.memo-thumbnail {
  margin-top: 0.5rem;
  max-width: 100%;
  border-radius: 6px;
}
.empty-message {
  color: #777;
  text-align: center;
  margin-top: 2rem;
}
</style>