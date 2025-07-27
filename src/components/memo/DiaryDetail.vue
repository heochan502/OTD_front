<script setup>
import '@/components/memo/diaryDetail.css';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDiaryDetail } from './useDiaryDetail';
import DiaryService from '@/services/memo/DiaryHttpService.js';

const route = useRoute();
const router = useRouter();
const routeId = computed(() => route.params.id);

const {
  diary,
  previewImages,
  fileInputRef,
  mode,
  isCreateMode,
  isViewMode,
  isEditMode,
  setMode,
  clearForm,
  fetchDiary,
  handleImageChange,
  removeImage,
} = useDiaryDetail();

const diaryList = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const totalDiaries = ref(0);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalDiaries.value / pageSize.value))
);

const fetchDiaryList = async () => {
  try {
    const res = await DiaryService.findAll({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    });
    diaryList.value = res.data.diaryList || [];
    totalDiaries.value = res.data.totalCount || 0;
  } catch (e) {
    alert('일기 목록 로딩 실패');
  }
};

const changePage = (num) => {
  if (num >= 1 && num <= totalPages.value) {
    currentPage.value = num;
    fetchDiaryList();
  }
};

const goToDiaryDetail = (id) => {
  if (route.params.id !== id) router.push(`/diary/${id}`);
};

const saveDiary = async () => {
  if (!diary.value.title?.trim()) {
    alert("제목을 입력하세요");
    return;
  }
  if (!diary.value.content?.trim()) {
    alert("내용을 입력하세요");
    return;
  }

  try {
    if (isEditMode.value) {
      await DiaryService.modify({ id: diary.value.id, ...diary.value });
    } else {
      const formData = new FormData();
      formData.append('title', diary.value.title);
      formData.append('content', diary.value.content);
      formData.append('mood', diary.value.mood);
      formData.append('date', diary.value.date);

      const files = Array.from(fileInputRef.value?.files || []);
      if (files.length > 5) {
        alert("이미지는 최대 5장까지 업로드 가능합니다.");
        return;
      }

      files.forEach(file => formData.append('images', file));
      await DiaryService.create(formData);
    }

    alert('저장 완료');
    await fetchDiaryList();
    router.push('/memo');
  } catch (e) {
    alert('저장 실패');
  }
};

const deleteDiary = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await DiaryService.deleteById(diary.value.id);
    alert('삭제 완료');
    diaryList.value = diaryList.value.filter(item => item.id !== diary.value.id);
    await fetchDiaryList();
    router.push('/memo');
  } catch (e) {
    alert('삭제 실패');
  }
};

const enableEdit = () => {
  setMode('edit');
};

onMounted(async () => {
  if (!routeId.value) {
    setMode('create');
    clearForm();
  } else {
    setMode('view');
    await fetchDiary(routeId.value);
  }

  fetchDiaryList();
});

watch(routeId, async (id) => {
  if (!id) {
    setMode('create');
    clearForm();
  } else {
    setMode('view');
    await fetchDiary(id);
  }
});
</script>

<template>
  <div class="diary-detail-container">
    <h2>{{ isCreateMode ? '일기 작성' : isEditMode ? '일기 수정' : '일기 보기' }}</h2>

    <div class="input-section">
      <label>제목</label>
      <input v-model="diary.title" :readonly="isViewMode" />
    </div>

    <div class="input-section">
      <label>내용</label>
      <textarea v-model="diary.content" rows="10" :readonly="isViewMode"></textarea>
    </div>

    <div class="input-section">
      <label>기분</label>
      <select v-model="diary.mood" :disabled="isViewMode">
        <option value="happy">😊 행복</option>
        <option value="sad">😢 슬픔</option>
        <option value="angry">😠 화남</option>
        <option value="neutral">😐 평범</option>
      </select>
    </div>

    <div class="input-section">
      <label>작성 날짜</label>
      <input type="date" v-model="diary.date" :disabled="isViewMode" />
    </div>

    <div class="input-section">
      <label>이미지 업로드 (최대 5장)</label>
      <input
        type="file"
        ref="fileInputRef"
        accept=".jpg, .jpeg, .png, .gif"
        multiple
        @change="handleImageChange"
        :disabled="isViewMode"
      />
      <div class="preview-list">
        <div v-for="(img, index) in previewImages" :key="index" class="preview-item">
          <img :src="img" />
          <button v-if="!isViewMode" @click="removeImage(index)" class="remove-btn">X</button>
        </div>
        <p v-if="isViewMode && previewImages.length === 0">등록된 이미지가 없습니다.</p>
      </div>
    </div>

    <div class="button-group">
      <button v-if="isCreateMode" @click="saveDiary">등록</button>
      <button v-if="isEditMode" @click="saveDiary">수정 완료</button>
      <button v-if="isViewMode" @click="enableEdit">수정</button>
      <button v-if="isViewMode" @click="deleteDiary" class="btn-danger">삭제</button>
      <button @click="router.push('/memo')">뒤로</button>
    </div>

    <hr style="margin: 40px 0; border-top: 1px solid #ccc;" />
    <h3>일기 목록</h3>

    <div class="diary-list-section">
      <div v-if="diaryList.length === 0" class="empty-message">
        등록된 일기가 없습니다.
      </div>
      <ul v-else class="diary-items">
        <li
          v-for="item in diaryList"
          :key="item.id"
          class="diary-item"
          @click="goToDiaryDetail(item.id)"
        >
          <strong>{{ item.title }}</strong>
          <span>{{ item.content.slice(0, 50) }}...</span>
          <small>{{ item.date }}</small>
        </li>
      </ul>
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">이전</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">다음</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>