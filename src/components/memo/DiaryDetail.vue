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
  isViewMode,
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
} = useDiaryDetail(emit);

const titleText = computed(() => {
  if (isCreateMode.value) return '다이어리 등록';
  if (isEditMode.value) return '다이어리 수정';
  return '다이어리 보기';
});

watch(
  () => props.diaryProp,
  (newDiary) => {
    if (newDiary) {
      diary.value = { ...newDiary };
      previewImages.value = newDiary.imageFileName ? [`/pic/${newDiary.imageFileName}`] : [];
      setMode('view');
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
    <input id="diaryName" v-model="diary.diaryName" class="text-input" />
    <p v-if="diary.diaryName.length > 0 && !isTitleValid" class="error">
      제목은 1자 이상 입력해주세요.
    </p>

    <label for="diaryContent">내용</label>
    <textarea id="diaryContent" v-model="diary.diaryContent" class="textarea" />
    <p v-if="diary.diaryContent.length > 0 && !isContentValid" class="error">
      내용은 10자 이상 입력해주세요.
    </p>

    <label>기분</label>
    <select v-model="diary.mood" class="text-input">
      <option v-for="option in MOOD_OPTIONS" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <label>이미지</label>
    <div v-if="previewImages.length > 0" class="preview-list">
      <div v-for="(img, idx) in previewImages" :key="idx" class="preview-item">
        <img :src="img" alt="미리보기 이미지" />
        <button v-if="!isViewMode" @click="removeImage(idx)" class="delete-btn">삭제</button>
      </div>
    </div>

    <input
      v-if="!isViewMode"
      ref="fileInputRef"
      type="file"
      accept="image/*"
      @change="handleImageChange"
    />

    <div class="button-group">
      <button v-if="isCreateMode" :disabled="!isTitleValid || !isContentValid" @click="createDiary">등록</button>

      <template v-else-if="isEditMode">
        <button :disabled="!isTitleValid || !isContentValid" @click="updateDiary">수정 완료</button>
        <button @click="cancelEdit">취소</button>
      </template>

      <template v-else>
        <button @click="setMode('edit')">수정</button>
        <button @click="deleteDiary">삭제</button>
        <button @click="cancelEdit">목록</button>
      </template>
    </div>
  </div>
</template>
