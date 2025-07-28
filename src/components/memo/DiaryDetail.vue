<script setup>
import { useDiaryDetail } from '@/components/memo/useDiaryDetail';
import { useAccountStore } from '@/stores/counter.js';
import { useRouter, useRoute } from 'vue-router';

const {
  diary,
  previewImages,
  fileInputRef,
  mode,
  isCreateMode,
  isEditMode,
  isViewMode,
  setMode,
  clearForm,
  fetchDiary,
  handleImageChange,
  removeImage,
  hasNoImages,
  imageCount,
  MOOD_OPTIONS,
  createDiary,
  updateDiary,
  deleteDiary,
  cancelEdit,
} = useDiaryDetail();

const accountStore = useAccountStore();
const router = useRouter();
const route = useRoute();
</script>

<template>
  <div class="diary-wrapper">
    <div class="diary-detail">
      <h2>일기</h2>

      <label>제목</label>
      <input type="text" v-model="diary.diaryName" />

      <label>내용</label>
      <textarea v-model="diary.diaryContent" />

      <label>기분</label>
      <select v-model="diary.mood">
        <option v-for="option in MOOD_OPTIONS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <label>이미지</label>
      <input type="file" ref="fileInputRef" @change="handleImageChange" />
      <div v-if="previewImages.length">
        <img :src="previewImages[0]" />
        <button @click="removeImage">X</button>
      </div>

      <div class="button-group">
        <button v-if="isCreateMode" @click="createDiary">등록</button>
        <template v-else-if="isEditMode">
          <button @click="updateDiary">수정 완료</button>
          <button @click="deleteDiary">삭제</button>
          <button @click="cancelEdit">취소</button>
        </template>
      </div>
    </div>
  </div>
</template>

<style src="./diaryDetail.css" />