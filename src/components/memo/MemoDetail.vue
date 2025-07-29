<script setup>
import { useMemoDetail } from '@/components/memo/useMemoDetail';
import '@/components/memo/MemoAndDiaryDetail.css';

const {
  memo,
  previewImages,
  fileInputRef,
  isCreateMode,
  isViewMode,
  isEditMode,
  setMode,
  handleImageChange,
  removeImage,
  createMemo,
  updateMemo,
  deleteMemo,
  cancelEdit,
} = useMemoDetail();

// 저장 처리 (등록 or 수정)
const saveMemo = () => {
  if (!memo.value.memoName || !memo.value.memoContent) {
    alert('제목과 내용을 모두 입력해주세요!');
    return;
  }
  isEditMode.value ? updateMemo() : createMemo();
};
</script>

<template>
  <div class="memo-detail">
    <h2 v-if="isCreateMode">메모 등록</h2>
    <h2 v-else-if="isViewMode">메모 보기</h2>
    <h2 v-else-if="isEditMode">메모 수정</h2>

    <label for="memoName">제목</label>
    <input
      id="memoName"
      v-model="memo.memoName"
      :disabled="isViewMode"
      type="text"
      placeholder="제목 입력"
      class="text-input"
    />

    <label for="memoContent">내용</label>
    <textarea
      id="memoContent"
      v-model="memo.memoContent"
      :disabled="isViewMode"
      placeholder="내용 입력"
      class="textarea"
    ></textarea>

    <label for="imageUpload">이미지 업로드</label>
    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      ref="fileInputRef"
      @change="handleImageChange"
      :disabled="isViewMode"
    />

    <div v-if="previewImages.length > 0" class="preview-list">
      <div class="preview-item" v-for="(url, idx) in previewImages" :key="idx">
        <img :src="url" alt="미리보기 이미지" />
        <button v-if="!isViewMode" class="remove-btn" @click="removeImage(idx)">삭제</button>
      </div>
    </div>
    <div v-else class="no-image">이미지가 없습니다.</div>

    <div class="button-group">
      <button v-if="isCreateMode" @click="saveMemo">등록</button>
      <button v-if="isEditMode" @click="saveMemo">수정 완료</button>

      <template v-if="isCreateMode || isEditMode">
        <button @click="cancelEdit">취소</button>
      </template>

      <template v-if="isViewMode">
        <button @click="setMode('edit')">수정</button>
        <button @click="deleteMemo">삭제</button>
      </template>
    </div>
  </div>
</template>