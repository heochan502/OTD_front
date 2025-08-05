<script setup>
import { computed, ref, watch } from 'vue';
import { useDiaryDetail, MOOD_OPTIONS } from './useDiaryDetail';
import '@/components/memo/MemoAndDiaryDetail.css';

const emit = defineEmits(['created', 'updated', 'deleted', 'cancel']);
const props = defineProps({
  diaryProp: { type: Object, default: () => null },
  mode: { type: String, default: 'create' },
});

const {
  diary,
  previewImages,
  fileInputRef,
  isCreateMode,
  isEditMode,
  isTitleValid,
  isContentValid,
  setMode,
  handleImageChange,
  removeImage,
  createDiary,
  updateDiary,
  deleteDiary,
  cancelEdit,
  clearForm,
  fetchDiary,
} = useDiaryDetail(emit);

const titleText = computed(() =>
  isCreateMode.value ? '다이어리 등록' : '다이어리 수정'
);

watch(
  () => props.mode,
  (newMode) => {
    if (newMode) setMode(newMode);
  },
  { immediate: true }
);

watch(
  () => props.diaryProp,
  async (newVal) => {
    if (newVal && newVal.diaryId) {
      await fetchDiary(newVal.diaryId);
    } else {
      clearForm();
      setMode('create');
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="diary-detail">
    <h2>{{ titleText }}</h2>

    <label for="diaryName">제목</label>
    <input id="diaryName" v-model="diary.diaryName" placeholder="제목을 입력하세요" class="text-input" />
    <p v-if="!isTitleValid && diary.diaryName !== ''" class="error">제목은 1자 이상 입력해주세요.</p>

    <label for="diaryContent">내용</label>
    <textarea id="diaryContent" v-model="diary.diaryContent" placeholder="내용을 입력하세요" class="textarea" />
    <p v-if="!isContentValid && diary.diaryContent !== ''" class="error">내용은 10자 이상 입력해주세요.</p>

    <label>기분</label>
    <div class="mood-options">
      <label
        v-for="option in MOOD_OPTIONS"
        :key="option.value"
        :class="['mood-button', { selected: diary.mood === option.value }]"
      >
        <input
          type="radio"
          :value="option.value"
          v-model="diary.mood"
          class="hidden-radio"
          :disabled="option.value === ''"
        />
        {{ option.label }}
      </label>
    </div>

    <label>이미지</label>
    <div class="image-section">
      <input ref="fileInputRef" type="file" accept="image/*" @change="handleImageChange" />
      <div class="preview-list">
        <div v-for="(img, idx) in previewImages" :key="idx" class="preview-container">
          <img :src="img" class="preview-image" />
          <button @click="removeImage(idx)" class="remove-btn">X</button>
        </div>
        <p v-if="previewImages.length === 0" class="empty-message">선택된 이미지가 없습니다.</p>
      </div>
    </div>

    <div class="button-group">
      <button v-if="isCreateMode" @click="createDiary" :disabled="!isTitleValid || !isContentValid">등록</button>
      <button v-else-if="isEditMode" @click="updateDiary" :disabled="!isTitleValid || !isContentValid">수정 완료</button>
      <button v-if="isEditMode" @click="cancelEdit">취소</button>
      <button v-if="isEditMode" @click="deleteDiary" class="delete-btn">삭제</button>
    </div>
  </div>
</template>

<style scoped>
.diary-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  color: #000;
}

.diary-detail h2 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.diary-detail label {
  display: block;
  margin-top: 20px;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 1.2rem;
}

.text-input,
.textarea,
input[type="file"] {
  width: 100%;
  font-size: 1.1rem;
  padding: 5px 24px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 24px;
  box-sizing: border-box;
}

.textarea {
  height: 350px;
  resize: vertical;
}

.mood-options {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.mood-button {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mood-button.selected {
  background-color: #50C3F7;
  color: white;
  font-weight: bold;
}

.hidden-radio {
  display: none;
}

.preview-list,
.preview-item,
.preview-item img,
.remove-btn,
.button-group,
.button-group button {
  /* 재사용을 위해 memo와 동일하게 작성 */
}
</style>
