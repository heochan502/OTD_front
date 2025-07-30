<script setup>
import { ref, onMounted } from 'vue';
import { MOOD_OPTIONS } from '@/components/memo/useDiaryDetail';
import DiaryHttpService from '@/services/memo/DiaryHttpService';

const props = defineProps({});
const emit = defineEmits(['select']);

const diaryList = ref([]);

const fetchDiaries = async () => {
  try {
    const res = await DiaryHttpService.findAll({ currentPage: 1, pageSize: 100 });
    diaryList.value = res.diaryList;
  } catch (err) {
    alert('다이어리 목록 조회 실패');
    console.error(err);
  }
};

onMounted(() => {
  fetchDiaries();
});

const getMoodLabel = (value) => {
  const mood = MOOD_OPTIONS.find((m) => m.value === value);
  return mood ? mood.label : '기타';
};

// ✅ 외부에서 호출할 수 있도록 expose
defineExpose({
  fetchDiaries,
});
</script>

<template>
  <div class="diary-list">
    <div
      v-for="item in diaryList"
      :key="item.id"
      class="diary-item"
      @click="$emit('select', item)"
    >
      <h3>{{ item.diaryName }}</h3>
      <p>{{ item.diaryContent }}</p>
      <p>기분: {{ getMoodLabel(item.mood) }}</p>
      <img
        v-if="item.imageFileName"
        :src="`/pic/${item.imageFileName}`"
        class="preview-image"
        alt="diary"
      />
    </div>
  </div>
</template>

<style scoped>
.diary-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.diary-item {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
.preview-image {
  margin-top: 12px;
  max-width: 200px;
  border-radius: 8px;
}
</style>