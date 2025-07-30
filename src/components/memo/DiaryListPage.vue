<script setup>
import { ref, onMounted } from 'vue';
import DiaryDetail from '@/components/memo/DiaryDetail.vue';
import DiaryList from '@/components/memo/DiaryList.vue';

const selectedDiary = ref(null);
const mode = ref('create');

const diaryListRef = ref(null);

const handleSelect = (diary) => {
  selectedDiary.value = diary;
  mode.value = 'view';
};

const handleClear = () => {
  selectedDiary.value = null;
  mode.value = 'create';
};

const refreshList = () => {
  diaryListRef.value?.fetchDiaries();
};
</script>

<template>
  <div class="diary-list-page">
    <DiaryDetail
      :mode="mode"
      :diary-prop="selectedDiary"
      @cancel="handleClear"
      @updated="handleClear"
      @deleted="() => { handleClear(); refreshList(); }"
      @created="() => { handleClear(); refreshList(); }"
    />

    <DiaryList ref="diaryListRef" @select="handleSelect" />
  </div>
</template>

<style scoped>
.diary-list-page {
  display: flex;
  flex-direction: column;
  gap: 60px;
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}
</style>