<script setup>
import { ref, onMounted } from 'vue';
import DiaryHttpService from '@/services/memo/DiaryHttpService';
import { useAccountStore } from '@/stores/counter';
import '@/components/memo/MemoAndDiaryDetail.css';

const emit = defineEmits(['select']);
const diaryList = ref([]);
const accountStore = useAccountStore();

const fetchDiaryList = async () => {
  const params = {
    currentPage: 1,
    pageSize: 100,
    memberNoLogin: accountStore.loggedInId,
  };

  try {
    const result = await DiaryHttpService.findAll(params);
    console.log('[diaryList] 서버 응답:', result);
    diaryList.value = result?.diaryList || [];
  } catch (err) {
    console.error('다이어리 목록 조회 실패:', err);
    diaryList.value = [];
  }
};

onMounted(fetchDiaryList);
defineExpose({ fetchDiaryList });

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};
</script>

<template>
  <div class="memo-list">
    <div
      v-for="diary in diaryList"
      :key="diary.id"
      class="memo-item"
      @click="$emit('select', diary)"
    >
      <h3>{{ diary.diaryName }}</h3>
      <p>{{ diary.diaryContent }}</p>
      <span class="date">{{ formatDate(diary.createdAt) }}</span>
      <img
        v-show="diary.imageFileName"
        :src="`/pic/${diary.imageFileName}`"
        class="preview-image"
        alt="diary"
      />
    </div>

    <div v-show="diaryList.length === 0" class="empty-message">
      등록된 다이어리가 없습니다.
    </div>
  </div>
</template>