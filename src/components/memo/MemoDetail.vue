<script setup>
import { useMemoDetail } from './useMemoDetail';
import '@/components/memo/MemoAndDiaryDetail.css';

const props = defineProps({ memoProp: Object });
const emit = defineEmits(['created', 'updated', 'deleted', 'cancel']);

const {
  memo,
  previewImages,
  fileInputRef,
  isCreateMode,
  isViewMode,
  isEditMode,
  setMode,
  createMemo,
  updateMemo,
  deleteMemo,
  cancelEdit,
  handleImageChange,
  removeImage,
  hasNoImages,
} = useMemoDetail(props, emit);
</script>

<template>
  <div class="memo-detail">
    <h2>메모 {{ isCreateMode ? '등록' : isEditMode ? '수정' : '보기' }}</h2>

    <label for="memoName">제목</label>
    <input id="memoName" v-model="memo.memoName" class="text-input" placeholder="제목을 입력하세요" />

    <label for="memoContent">내용</label>
    <textarea id="memoContent" v-model="memo.memoContent" class="textarea" placeholder="내용을 입력하세요" />

    <label>이미지</label>
    <input type="file" ref="fileInputRef" @change="handleImageChange" accept="image/*" />

    <div v-if="previewImages.length" class="preview-list">
      <img v-for="(url, idx) in previewImages" :key="idx" :src="url" alt="미리보기" />
      <button @click="removeImage" class="remove-btn">🗑️ 삭제</button>
    </div>

    <div v-if="hasNoImages" class="no-image">등록된 이미지가 없습니다.</div>

    <div class="button-group">
      <button v-if="isCreateMode" @click="createMemo">등록</button>
      <button v-else-if="isEditMode" @click="updateMemo">수정 완료</button>
      <button v-else @click="setMode('edit')">수정</button>

      <button v-if="!isCreateMode" @click="deleteMemo">삭제</button>
      <button v-if="!isCreateMode" @click="cancelEdit">취소</button>
    </div>
  </div>
</template>