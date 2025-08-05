<script setup>
import { computed, ref, watch } from 'vue';
import { useMemoDetail } from '@/components/memo/useMemoDetail';
import { defineEmits, defineProps } from 'vue';
import '@/components/memo/MemoAndDiaryDetail.css';

const emit = defineEmits(['created', 'updated', 'deleted', 'cancel']);
const props = defineProps({
  memoProp: {
    type: Object,
    default: () => null,
  },
});

const {
  memo,
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
  createMemo,
  updateMemo,
  deleteMemo,
  cancelEdit,
  clearPreviewImages,
} = useMemoDetail(props, emit);

const titleText = computed(() => {
  if (isCreateMode.value) return '메모 등록';
  if (isEditMode.value) return '메모 수정';
  return '메모 보기';
});

watch(
  () => props.memoProp,
  (newMemo) => {
    if (newMemo) {
      memo.value = { ...newMemo };
      setMode('view');
      clearPreviewImages(); // 선택 시 이전 이미지 프리뷰 제거
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="memo-detail">
    <h2>{{ titleText }}</h2>

    <label for="memoName">제목</label>
    <input id="memoName" v-model="memo.memoName" class="text-input" />
    <p v-if="memo.memoName.length > 0 && !isTitleValid" class="error">
      제목은 10자 이상 입력해주세요.
    </p>

    <label for="memoContent">내용</label>
    <textarea id="memoContent" v-model="memo.memoContent" class="textarea" />
    <p v-if="memo.memoContent.length > 0 && !isContentValid" class="error">
      내용은 10자 이상 입력해주세요.
    </p>

    <label>이미지</label>

    <div v-if="memo.imageFileName && previewImages.length === 0" class="preview-list">
      <div class="preview-item">
        <img :src="`/pic/${memo.imageFileName}`" alt="등록된 이미지" />
      </div>
    </div>

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
      <button
        v-if="isCreateMode"
        :disabled="!isTitleValid || !isContentValid"
        @click="createMemo"
      >
        등록
      </button>

      <template v-else-if="isEditMode">
        <button :disabled="!isTitleValid || !isContentValid" @click="updateMemo">수정 완료</button>
        <button @click="cancelEdit">취소</button>
      </template>

      <template v-else>
        <button @click="setMode('edit')">수정</button>
        <button @click="deleteMemo">삭제</button>
        <button @click="cancelEdit">목록</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.memo-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  color: #000;
}

.memo-detail h2 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.memo-detail label {
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

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 24px;
}

.preview-item {
  width: 120px;
  height: 120px;
  position: relative;
  background-color: #eee;
  border-radius: 8px;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
}

.button-group button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  background-color: #50C3F7;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
</style>