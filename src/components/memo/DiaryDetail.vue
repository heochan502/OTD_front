<script setup>
import { useDiaryDetail, MOOD_OPTIONS } from '@/components/memo/useDiaryDetail';
import '@/components/memo/MemoAndDiaryDetail.css';

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
  hasNoImages,
} = useDiaryDetail();
</script>

<template>
  <div class="diary-detail">
    <h2 v-if="isCreateMode">다이어리 등록</h2>
    <h2 v-else-if="isViewMode">다이어리 보기</h2>
    <h2 v-else-if="isEditMode">다이어리 수정</h2>

    <label for="diaryName">제목</label>
    <input
      id="diaryName"
      v-model="diary.diaryName"
      :disabled="isViewMode"
      type="text"
      placeholder="제목 입력"
      class="text-input"
    />

    <label for="diaryContent">내용</label>
    <textarea
      id="diaryContent"
      v-model="diary.diaryContent"
      :disabled="isViewMode"
      placeholder="내용 입력"
      class="textarea"
    ></textarea>

    <label for="mood">기분</label>
    <select
      id="mood"
      v-model="diary.mood"
      :disabled="isViewMode"
      class="text-input"
    >
      <option
        v-for="option in MOOD_OPTIONS"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <label for="imageUpload">이미지 업로드</label>
    <input
      id="imageUpload"
      ref="fileInputRef"
      type="file"
      accept="image/*"
      @change="handleImageChange"
      :disabled="isViewMode"
    />

    <div v-if="previewImages.length > 0" class="preview-list">
      <div class="preview-item" v-for="(url, idx) in previewImages" :key="idx">
        <img :src="url" alt="프리뷰 이미지" />
        <button
          v-if="!isViewMode"
          class="remove-btn"
          @click="removeImage(idx)"
        >
          삭제
        </button>
      </div>
    </div>
    <div v-else class="no-image">이미지가 없습니다.</div>

    <div class="button-group">
      <button v-if="isCreateMode" @click="createDiary">등록</button>
      <button v-if="isEditMode" @click="updateDiary">수정 완료</button>

      <template v-if="isCreateMode || isEditMode">
        <button @click="cancelEdit">취소</button>
      </template>

      <template v-if="isViewMode">
        <button @click="setMode('edit')">수정</button>
        <button @click="deleteDiary">삭제</button>
      </template>
    </div>
  </div>
</template>