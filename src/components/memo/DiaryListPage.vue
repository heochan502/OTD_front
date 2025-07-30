<script setup>
import { ref, nextTick, onMounted } from 'vue';
import DiaryDetail from '@/components/memo/DiaryDetail.vue';
import DiaryList from '@/components/memo/DiaryList.vue';
import { useRoute } from 'vue-router';
import DiaryHttpService from '@/services/memo/DiaryHttpService';

const selectedDiary = ref(null);
const mode = ref('create');  // 'create' | 'view' | 'edit'

const diaryListRef = ref(null);
const diaryDetailRef = ref(null);

const route = useRoute();

const handleCreated = async () => {
  handleClear();
  await diaryListRef.value?.fetchDiaryList();
};

const handleUpdated = async () => {
  handleClear();
  await diaryListRef.value?.fetchDiaryList();
};

const handleDeleted = async () => {
  selectedDiary.value = null;
  mode.value = 'create';
  await nextTick();
  diaryDetailRef.value?.clearForm?.();
  await diaryListRef.value?.fetchDiaryList();
};

const handleSelect = (diary) => {
  selectedDiary.value = diary;
  mode.value = 'view';
};

const handleClear = () => {
  selectedDiary.value = null;
  mode.value = 'create';
};

onMounted(() => {
  if (route.params.id) {
    mode.value = 'view';
    fetchDiary(route.params.id);  
  } else {
    mode.value = 'create'; 
  }
});

const fetchDiary = async (id) => {
  try {
    const response = await DiaryHttpService.findById(id);
    if (response && response.data) {
      selectedDiary.value = response.data;
    }
  } catch (error) {
    console.error('다이어리 조회 실패:', error);
  }
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
    <DiaryList ref="diaryListRef" @select="handleSelect" />
  </div>
</template>