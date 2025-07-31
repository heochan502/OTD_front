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
    pageSize: 5,
    memberNoLogin: accountStore.loggedInId,
  };

  try {
    const result = await DiaryHttpService.findAll(params);

    // 🔍 여기 로그 추가
    console.log('[📘 diaryList 전체 응답]', result);
    console.table(result?.diaryList);
    result?.diaryList?.forEach((item, idx) => {
      console.log(`[${idx}] diaryId: ${item.diaryId}, diaryName: ${item.diaryName}, diaryImage: ${item.diaryImage}`);
    });

    diaryList.value = result?.diaryList || [];
  } catch (err) {
    console.error('다이어리 목록 조회 실패:', err);
    diaryList.value = [];
  }
};

onMounted(fetchDiaryList);
defineExpose({ fetchDiaryList });

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return isNaN(date) ? '' : date.toLocaleDateString();
};
</script>

<template>
  <div class="memo-list">
    <div v-if="Array.isArray(diaryList) && diaryList.length > 0">
      <div
        v-for="diary in diaryList"
        :key="diary.diaryId"
        class="memo-item"
        @click="$emit('select', diary)"
      >
        <div class="diary-item-content">
          <div class="diary-text">
          <h3>{{ diary.diaryName }}</h3>
          <p>{{ diary.diaryContent }}</p>
          <span class="date">{{ formatDate(diary.createdAt) }}</span>
        </div>
        <div class="diary-image-wrapper" v-if="diary.diaryImage">
        <img
          :src="`http://localhost:8080/pic/${diary.diaryImage}`"
          class="preview-image"
          alt="다이어리 이미지"
          @error="e => console.error('❌ 이미지 로딩 실패:', e.target.src)"
        />
      </div>
    </div>
  </div>
</div>

    <div v-else class="empty-message">
      등록된 다이어리가 없습니다.
    </div>
  </div>
</template>