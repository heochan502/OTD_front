<script setup>
import '@/components/memo/diaryDetail.css';
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDiaryDetail } from './useDiaryDetail.js';
import DiaryService from '@/services/memo/DiaryHttpService.js';
import { formatDateTime } from '@/utils/MemoAndDiaryApi'; // ✅ 파일명 대소문자 주의
import api from '@/utils/MemoAndDiaryApi'; // ✅ casing 맞춤

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

const state = reactive({
  diaryList: [],
  currentPage: 1,
  pageSize: 5,
  totalDiaries: 0,
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(state.totalDiaries / state.pageSize))
);

const fetchDiaryList = async () => {
  try {
    const result = await DiaryHttpService.findAll({
      currentPage: state.currentPage,
      pageSize: state.pageSize
    });
    state.diaryList = result.diaryList;
    state.totalDiaries = result.totalCount;
  } catch (err) {
    alert('일기 목록 로딩 실패');
  }
};

const changePage = (num) => {
  if (num >= 1 && num <= totalPages.value) {
    state.currentPage = num;
    fetchDiaryList();
  }
};

const goToDiaryDetail = (id) => {
  if (route.params.id !== id) router.push(`/diary/${id}`);
};

const saveDiary = async () => {
  if (!diary.value.diaryName?.trim() || !diary.value.diaryContent?.trim()) {
    alert('제목과 내용을 입력하세요.');
    return;
  }

  try {
    if (isEditMode.value) {
      await DiaryHttpService.modify({ id: diary.value.id, ...diary.value });
    } else {
      const formData = new FormData();
      formData.append('diaryName', diary.value.diaryName);
      formData.append('diaryContent', diary.value.diaryContent);
      formData.append('mood', diary.value.mood || '');
      const files = Array.from(fileInputRef.value?.files || []);
      files.forEach(f => formData.append('diaryImageFiles', f));
      await DiaryHttpService.create(formData);
    }

    alert('저장 완료');
    router.push('/diary');
  } catch {
    alert('저장 실패');
  }
};

const deleteDiary = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await DiaryHttpService.deleteById(diary.value.id);
    alert('삭제 완료');
    router.push('/diary');
  } catch {
    alert('삭제 실패');
  }
};

const enableEdit = () => setMode('edit');

onMounted(async () => {
  try {
    await api.get('/account/check');
  } catch {
    return;
  }

  if (!routeId.value || routeId.value === 'create') {
    setMode('create');
    clearForm();
    await fetchDiaryList();
  } else {
    setMode('view');
    await fetchDiary(routeId.value);
  }
});
</script>

<template>
  <div class="diary-detail-container">
    <h2>{{ isCreateMode ? '일기 작성' : isEditMode ? '일기 수정' : '일기 보기' }}</h2>

    <div class="input-section">
      <label>제목</label>
      <input v-model="diary.diaryName" :readonly="isViewMode" />
    </div>

    <div class="input-section">
      <label>기분</label>
      <select v-model="diary.mood" :disabled="isViewMode">
        <option value="">선택</option>
        <option value="좋음">좋음</option>
        <option value="보통">보통</option>
        <option value="나쁨">나쁨</option>
      </select>
    </div>

    <div class="input-section">
      <label>작성일</label>
      <input type="date" v-model="diary.createdAt" :disabled="isViewMode" />
    </div>

    <div class="input-section">
      <label>내용</label>
      <textarea v-model="diary.diaryContent" rows="10" :readonly="isViewMode"></textarea>
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
      <button @click="router.push('/diary')">뒤로</button>
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
          <strong>{{ item.diaryName }}</strong>
          <span>{{ item.diaryContent.slice(0, 50) }}...</span>
          <small>{{ formatDateTime(item.createdAt) }}</small>
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