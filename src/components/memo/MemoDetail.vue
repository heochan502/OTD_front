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