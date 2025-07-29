<script setup>
import { ref } from 'vue';
import MemoHttpService from '@/services/memo/MemoHttpService';
import { useRouter } from 'vue-router';
import '@/components/memo/MemoAndDiaryDetail.css';

const router = useRouter();

const memo = ref({
  memoName: '',
  memoContent: '',
  memoImageFiles: null,
});

const previewImages = ref([]);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    memo.value.memoImageFiles = file;
    previewImages.value = [URL.createObjectURL(file)];
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

    <label for="memoName">제목</label>
    <input
      id="memoName"
      v-model="memo.memoName"
      type="text"
      placeholder="제목 입력"
      class="text-input"
    />

    <label for="memoContent">내용</label>
    <textarea
      id="memoContent"
      v-model="memo.memoContent"
      placeholder="내용 입력"
      class="textarea"
    ></textarea>

    <label for="imageUpload">이미지 업로드</label>
    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      @change="handleImageChange"
    />

    <div v-if="previewImages.length > 0" class="preview-list">
      <div class="preview-item" v-for="(url, idx) in previewImages" :key="idx">
        <img :src="url" alt="미리보기 이미지" />
        <button class="remove-btn" @click="previewImages.splice(idx, 1)">삭제</button>
      </div>
    </div>
    <div v-else class="no-image">이미지가 없습니다.</div>

    <div class="button-group">
      <button @click="saveMemo">등록</button>
    </div>
  </div>
</template>