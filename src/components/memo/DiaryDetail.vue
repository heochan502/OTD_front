<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DiaryHttpService from '@/services/memo/DiaryHttpService';

const route = useRoute();
const router = useRouter();

const diary = ref({
  id: null,
  title: '',
  content: '',
  imageFileName: null,
});

const diaryList = ref([]);
const previewImage = ref('');
const mode = ref('create');

const isCreateMode = computed(() => mode.value === 'create');
const isEditMode = computed(() => mode.value === 'edit');

// 초기 진입 처리
onMounted(async () => {
  const id = route.params.id;
  if (id) {
    mode.value = 'edit';
    const res = await DiaryHttpService.findById(id);
    diary.value = res;
    if (res.imageFileName) {
      previewImage.value = `/pic/${res.imageFileName}`;
    }
  } else {
    mode.value = 'create';
  }

  if (!isCreateMode.value) {
    diaryList.value = await DiaryHttpService.findAll({ page: 1, pageSize: 10 });
  }
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  previewImage.value = '';
};

const createDiary = async () => {
  const formData = new FormData();

  // 백엔드 DiaryPostReq 필드명과 일치해야 함
  formData.append(
    'diaryData',
    new Blob(
      [JSON.stringify({
        diaryName: diary.value.diaryName,     // ✅ 정확한 키 확인
        diaryContent: diary.value.diaryContent
      })],
      { type: 'application/json' }
    )
  );

  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput?.files[0]) {
    formData.append('diaryImageFiles', fileInput.files[0]); // ✅ 한 번만 append
  }

  try {
    await DiaryHttpService.create(formData);
    alert('등록 완료');
    router.push('/diary');
  } catch (error) {
    console.error('등록 실패:', error);
    alert('등록 중 오류가 발생했습니다.');
  }
};

const updateDiary = async () => {
  await DiaryHttpService.modify(diary.value);
  alert('수정 완료');
};

const deleteDiary = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await DiaryHttpService.deleteById(diary.value.id);
    alert('삭제 완료');
    router.push('/diary');
  }
};

const cancelEdit = () => {
  router.push('/diary');
};
</script>


<template>
  <div class="diary-wrapper">
    <div class="diary-detail">
      <h2>일기</h2>

      <label for="title">제목</label>
      <input id="title" type="text" v-model="diary.title" />

      <label for="content">내용</label>
      <textarea id="content" v-model="diary.content" />

      <label for="image">이미지</label>
      <input type="file" @change="handleFileChange" />

      <div class="preview-list" v-if="previewImage">
        <div class="preview-item">
          <img :src="previewImage" />
          <button class="remove-btn" @click="removeImage">X</button>
        </div>
      </div>

      <div class="button-group">
        <!-- 등록 버튼 (create 모드) -->
        <button v-if="isCreateMode" @click="createDiary">등록</button>

        <!-- 수정/삭제/취소 버튼 (edit 모드) -->
        <template v-if="isEditMode">
          <button @click="updateDiary">수정 완료</button>
          <button @click="deleteDiary">삭제</button>
          <button @click="cancelEdit">취소</button>
        </template>
      </div>

      <!-- 리스트는 view/edit 모드에서만 표시 -->
      <div class="diary-list" v-if="!isCreateMode">
        <h3 class="h3">전체 일기 목록</h3>
        <ul>
          <li v-for="item in diaryList" :key="item.id">
            {{ item.title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style src="./diaryDetail.css" />