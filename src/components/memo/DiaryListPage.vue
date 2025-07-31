<script setup>
import { ref, nextTick } from 'vue';
import DiaryDetail from '@/components/memo/DiaryDetail.vue';
import DiaryList from '@/components/memo/DiaryList.vue';

const selectedDiary = ref(null);
const mode = ref('create');

const diaryListRef = ref(null);
const diaryDetailRef = ref(null);

const handleCreated = async () => {
  await diaryListRef.value?.fetchDiaryList();
  diaryDetailRef.value?.clearForm?.();
  selectedDiary.value = null;
  mode.value = 'create';
};

const handleUpdated = async () => {
  await diaryListRef.value?.fetchDiaryList();
  selectedDiary.value = null;
  mode.value = 'create';
};

const handleDeleted = async () => {
  selectedDiary.value = null;
  await nextTick();
  diaryDetailRef.value?.clearForm?.();
  await diaryListRef.value?.fetchDiaryList();
  mode.value = 'create';
};

const handleSelect = (diary) => {
  selectedDiary.value = diary;
  mode.value = 'edit';
};

const handleClear = () => {
  selectedDiary.value = null;
  mode.value = 'create';
};
</script>

<template>
  <div class="diary-list-page">
    <DiaryDetail
      ref="diaryDetailRef"
      :mode="mode"
      :diary-prop="selectedDiary"
      @created="handleCreated"
      @updated="handleUpdated"
      @deleted="handleDeleted"
      @cancel="handleClear"
    />
    <DiaryList
      ref="diaryListRef"
      @select="handleSelect"
    />
  </div>
</template>
