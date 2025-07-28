<script setup>
import { ref } from 'vue';
import MemoHttpService from '@/services/memo/MemoHttpService'; // 메모 서비스

const memo = ref({
  memoName: '',
  memoContent: '',
  imageFile: null,
});

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    memo.value.imageFile = file; // 선택된 이미지 파일을 memo 객체에 저장
  }
};

const saveMemo = async () => {
  if (!memo.value.memoName || !memo.value.memoContent) {
    alert('제목과 내용을 모두 입력해주세요!');
    return;
  }

  // FormData 객체 생성
  const formData = new FormData();
  formData.append('memoData', new Blob([JSON.stringify({
    memoName: memo.value.memoName,
    memoContent: memo.value.memoContent,
  })], { type: 'application/json' }));

  if (memo.value.imageFile) {
    formData.append('memoImageFiles', memo.value.imageFile); // 이미지 파일 추가
  }

  try {
    // MemoHttpService를 이용해 메모 저장
    await MemoHttpService.create(formData);
    alert('메모가 저장되었습니다!');
    // 저장 후 필요한 처리를 여기서 추가할 수 있습니다.
  } catch (error) {
    console.error('메모 저장 실패:', error);
    alert('메모 저장 실패');
  }
};
</script>

<template>
  <div class="memo-detail">
    <h2>메모 등록</h2>

    <!-- 제목 입력 -->
    <label for="memoName">제목</label>
    <input v-model="memo.memoName" placeholder="제목" id="memoName" />

    <!-- 내용 입력 -->
    <label for="memoContent">내용</label>
    <textarea v-model="memo.memoContent" placeholder="내용" id="memoContent"></textarea>

    <!-- 이미지 업로드 -->
    <label for="fileInput">이미지 업로드</label>
    <input type="file" id="fileInput" @change="handleImageChange" />

    <!-- 버튼 그룹 -->
    <div class="button-group">
      <button @click="saveMemo">저장</button>
    </div>
  </div>
</template>

<style src="@/components/memo/MemoAndDiaryDetail.css" />