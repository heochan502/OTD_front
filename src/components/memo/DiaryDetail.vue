<script setup>
import { useDiaryDetail, MOOD_OPTIONS } from '@/components/memo/useDiaryDetail';
import '@/components/memo/MemoAndDiaryDetail.css';

const props = defineProps({
  diaryProp: Object,
});
const emit = defineEmits(['created', 'updated', 'deleted', 'cancel']);

const {
  diary,
  previewImages,
  fileInputRef,
  isCreateMode,
  isViewMode,
  isEditMode,
  setMode,
  handleImageChange,
  removeImage,
  createDiary,
  updateDiary,
  deleteDiary,
  cancelEdit,
} = useDiaryDetail(props, emit);
</script>

<template>
  <div class="diary-detail">
    <h2>다이어리 {{ isCreateMode ? '등록' : isEditMode ? '수정' : '상세 보기' }}</h2>

    <!-- 제목 입력 -->
    <input v-model="diary.diaryName" class="text-input" placeholder="제목을 입력하세요" :readonly="isViewMode" />

    <!-- 내용 입력 -->
    <textarea v-model="diary.diaryContent" class="textarea" placeholder="내용을 입력하세요" :readonly="isViewMode" />

    <!-- 기분 선택 -->
    <select v-model="diary.mood" class="text-input" :disabled="isViewMode">
      <option v-for="option in MOOD_OPTIONS" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <!-- 이미지 업로드 -->
    <input type="file" ref="fileInputRef" @change="handleImageChange" accept="image/*" v-if="!isViewMode" />

    <!-- 이미지 미리보기 -->
    <div class="preview-list" v-if="previewImages.length">
      <img v-for="(img, index) in previewImages" :key="index" :src="img" class="preview-image" />
      <button @click="removeImage" v-if="!isViewMode">이미지 제거</button>
    </div>

    <!-- 버튼 -->
    <div class="button-group">
      <button v-if="isCreateMode" @click="createDiary">등록</button>
      <button v-else-if="isEditMode" @click="updateDiary">수정 완료</button>
      <button v-if="isEditMode" @click="cancelEdit">취소</button>
      <button v-if="isViewMode" @click="setMode('edit')">수정</button>
      <button v-if="!isCreateMode" @click="deleteDiary">삭제</button>
    </div>
  </div>
</template>