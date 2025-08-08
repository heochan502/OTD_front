<script setup>
import { ref, onMounted } from 'vue';
import DiaryHttpService from '@/services/memo/DiaryHttpService';
import { useAccountStore } from '@/stores/counter';

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
    console.log('[📘 diaryList 전체 응답]', result);
    console.table(result?.diaryList);
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
  <div class="diary-list">
    <div v-if="Array.isArray(diaryList) && diaryList.length > 0">
      <div
        v-for="diary in diaryList"
        :key="diary.diaryId"
        class="diary-item"
        @click="$emit('select', diary)"
      >
        <div class="diary-item-content">
          <div class="diary-text">
            <h3>{{ diary.diaryName }}</h3>
            <p>{{ diary.diaryContent }}</p>
            <span class="diary-date">{{ formatDate(diary.createdAt) }}</span>
          </div>
          <div class="diary-image-wrapper" v-if="diary.diaryImage">
            <img
              :src="`http://localhost:8080/pic/${diary.diaryImage}`"
              class="diary-preview-image"
              alt="다이어리 이미지"
              @error="
                (e) => console.error('❌ 이미지 로딩 실패:', e.target.src)
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="diary-empty-message">등록된 다이어리가 없습니다.</div>
  </div>
</template>

<style scoped>
.diary-list {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  color: #000;
}

.diary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f5f5f5;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.diary-item-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.diary-text {
  flex: 1;
  padding-right: 16px;
}

.diary-preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 24px;
}

.diary-date {
  font-size: 0.9rem;
  color: #888;
}

.diary-empty-message {
  text-align: center;
  color: #999;
  margin-top: 20px;
}

.diary-image-wrapper {
  flex-shrink: 0;
}

/* 📱 모바일 반응형 */
@media (max-width: 768px) {
  .diary-list {
    padding: 16px;
  }

  .diary-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .diary-preview-image {
    width: 100px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    margin-left: 0;
    margin-top: 12px;
  }

  .diary-item-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
