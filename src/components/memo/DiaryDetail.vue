<script setup>
import { ref } from 'vue';

const diary = ref({
  diaryName: '',
  diaryContent: '',
  mood: '',
  imageFile: null,
});

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    diary.value.imageFile = file; // 파일을 다이어리 객체에 저장
  }
};

const saveDiary = () => {
  if (!diary.value.diaryName || !diary.value.diaryContent) {
    alert('제목과 내용을 모두 입력해주세요!');
    return;
  }

  // 다이어리 저장 로직 (예: 서버로 전송)
  alert('다이어리가 저장되었습니다!');
};
</script>

<template>
  <div class="diary-detail">
    <h2>다이어리 등록</h2>

    <!-- 제목 입력 -->
    <label for="diaryName">제목</label>
    <input v-model="diary.diaryName" placeholder="제목" id="diaryName" />

    <!-- 내용 입력 -->
    <label for="diaryContent">내용</label>
    <textarea v-model="diary.diaryContent" placeholder="내용" id="diaryContent"></textarea>

    <!-- 기분 선택 -->
    <label for="mood">기분</label>
    <select v-model="diary.mood" id="mood">
      <option value="happy">행복</option>
      <option value="sad">슬픔</option>
      <option value="angry">화남</option>
    </select>

    <!-- 이미지 업로드 -->
    <label for="fileInput">이미지 업로드</label>
    <input type="file" id="fileInput" @change="handleImageChange" />

    <!-- 버튼 그룹 -->
    <div class="button-group">
      <button @click="saveDiary">저장</button>
    </div>
  </div>
</template>

<style src="@/components/memo/MemoAndDiaryDetail.css" />
