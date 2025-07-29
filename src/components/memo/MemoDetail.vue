<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import MemoHttpService from '@/services/memo/MemoHttpService';

const router = useRouter();

const memo = ref({
  memoName: '',
  memoContent: '',
  memoImageFiles: null,
});

const previewImage = ref(null);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    memo.value.memoImageFiles = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

const saveMemo = async () => {
  if (!memo.value.memoName || !memo.value.memoContent) {
    alert('제목과 내용을 모두 입력해주세요!');
    return;
  }

  const formData = new FormData();
  formData.append(
    'memoData',
    new Blob(
      [JSON.stringify({
        memoName: memo.value.memoName,
        memoContent: memo.value.memoContent,
      })],
      { type: 'application/json' }
    )
  );

  if (memo.value.memoImageFiles) {
    formData.append('memoImageFiles', memo.value.memoImageFiles);
  }

  try {
    await MemoHttpService.create(formData);
    alert('메모가 저장되었습니다!');
    router.push('/memoAndDiary/memolist');
  } catch (error) {
    console.error('메모 저장 실패:', error);
    alert('메모 저장 실패');
  }
};
</script>

<template>
  <div class="memo-detail">
    <h2>메모 등록</h2>

    <!-- 제목 -->
    <label for="memoName">제목</label>
    <input v-model="memo.memoName" id="memoName" placeholder="제목 입력" />

    <!-- 내용 -->
    <label for="memoContent">내용</label>
    <textarea v-model="memo.memoContent" id="memoContent" placeholder="내용 입력" />

    <!-- 이미지 업로드 -->
    <div class="image-section">
      <label>이미지</label>
      <input type="file" accept="image/*" @change="handleImageChange" />
      <div v-if="previewImage">
        <img :src="previewImage" alt="미리보기" class="preview-img" />
      </div>
    </div>

    <!-- 버튼 -->
    <div class="button-group">
      <button @click="saveMemo">등록</button>
    </div>
  </div>
</template>

<style src="@/components/memo/MemoAndDiaryDetail.css" />