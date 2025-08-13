<script setup>
import { computed, ref, watch } from 'vue';
import { useDiaryDetail, MOOD_OPTIONS } from './useDiaryDetail';

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
    <h2 class="diary-title">{{ titleText }}</h2>

    <label for="diaryName" class="diary-label">제목</label>
    <input id="diaryName" v-model="diary.diaryName" placeholder="제목을 입력하세요" class="diary-input" />
    <p v-if="!isTitleValid && diary.diaryName !== ''" class="diary-error">제목은 1자 이상 입력해주세요.</p>

    <label for="diaryContent" class="diary-label">내용</label>
    <textarea id="diaryContent" v-model="diary.diaryContent" placeholder="내용을 입력하세요" class="diary-textarea" />
    <p v-if="!isContentValid && diary.diaryContent !== ''" class="diary-error">내용은 10자 이상 입력해주세요.</p>

    <label class="diary-label">기분</label>
    <div class="diary-mood-options">
      <label
        v-for="option in MOOD_OPTIONS"
        :key="option.value"
        :class="['diary-mood-button', { selected: diary.mood === option.value }]"
      >
        <input
          type="radio"
          :value="option.value"
          v-model="diary.mood"
          class="diary-radio-hidden"
          :disabled="option.value === ''"
        />
        {{ option.label }}
      </label>
    </div>

    <label class="diary-label">이미지</label>
    <div class="image-section">
      <input ref="fileInputRef" type="file" accept="image/*" @change="handleImageChange" class="diary-file-input" />
      <div class="diary-preview-list">
        <div v-for="(img, idx) in previewImages" :key="idx" class="diary-preview-container">
          <img :src="img" class="diary-preview-image" />
          <button @click="removeImage(idx)" class="diary-remove-btn">X</button>
        </div>
        <p v-if="previewImages.length === 0" class="diary-empty-message">선택된 이미지가 없습니다.</p>
      </div>
    </div>

    <div class="diary-button-group">
      <button v-if="isCreateMode" @click="createDiary" :disabled="!isTitleValid || !isContentValid">등록</button>
      <button v-else-if="isEditMode" @click="updateDiary" :disabled="!isTitleValid || !isContentValid">수정 완료</button>
      <button v-if="isEditMode" @click="cancelEdit">취소</button>
      <button v-if="isEditMode" @click="deleteDiary" class="diary-delete-btn">삭제</button>
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

.diary-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.diary-label {
  display: block;
  margin-top: 20px;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 1.2rem;
}

.diary-input,
.diary-textarea,
.diary-file-input {
  width: 100%;
  font-size: 1.1rem;
  padding: 5px 24px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 24px;
  box-sizing: border-box;
}

.diary-textarea {
  height: 350px;
  resize: vertical;
}

.diary-mood-options {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.diary-mood-button {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.diary-mood-button.selected {
  background-color: #50C3F7;
  color: white;
  font-weight: bold;
}

.diary-radio-hidden {
  display: none;
}

.diary-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
}

.diary-preview-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.diary-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.diary-remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-weight: bold;
  cursor: pointer;
}

.diary-empty-message {
  color: #aaa;
  font-style: italic;
  margin-top: 10px;
}

.diary-button-group {
  display: flex;
  gap: 10px;
  margin-top: 24px;
  justify-content: center;
}

.diary-button-group button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #50C3F7;
  color: white;
  transition: background-color 0.2s;
}

.diary-button-group button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.diary-button-group .diary-delete-btn {
  background-color: #dc3545;
}

.diary-error {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: -16px;
  margin-bottom: 12px;
}
</style>