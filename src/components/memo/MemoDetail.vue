<script setup>
import '@/components/memo/memoDetail.css';
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMemoDetail } from './useMemoDetail';
import MemoHttpService from '@/services/memo/MemoHttpService.js';
import { formatDateTime } from '@/utils/MemoAndDiaryApi';
import api from '@/utils/MemoAndDiaryApi';

const route = useRoute();
const router = useRouter();
const routeId = computed(() => route.params.id);

const {
  memo,
  previewImages,
  fileInputRef,
  mode,
  isCreateMode,
  isViewMode,
  isEditMode,
  setMode,
  clearForm,
  fetchMemo,
  handleImageChange,
  removeImage,
} = useMemoDetail();

const state = reactive({
  memoList: [],
  currentPage: 1,
  pageSize: 5,
  totalMemos: 0,
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(state.totalMemos / state.pageSize))
);

const fetchMemoList = async () => {
  try {
    const result = await MemoHttpService.findAll({
      currentPage: state.currentPage,
      pageSize: state.pageSize
    });
    state.memoList = result.memoList;
    state.totalMemos = result.totalCount;
  } catch (err) {
    alert('메모 목록 로딩 실패');
  }
};

const changePage = (num) => {
  if (num >= 1 && num <= totalPages.value) {
    state.currentPage = num;
    fetchMemoList();
  }
};

const goToMemoDetail = (id) => {
  if (route.params.id !== id) router.push(`/memo/${id}`);
};

const saveMemo = async () => {
  if (!memo.value.memoName?.trim() || !memo.value.memoContent?.trim()) {
    alert('제목과 내용을 모두 입력하세요.');
    return;
  }

  try {
    if (isEditMode.value) {
      await MemoHttpService.modify({ id: memo.value.id, ...memo.value });
    } else {
      const formData = new FormData();
      formData.append('memoName', memo.value.memoName);
      formData.append('memoContent', memo.value.memoContent);
      const files = Array.from(fileInputRef.value?.files || []);
      files.forEach(f => formData.append('memoImageFiles', f));
      await MemoHttpService.create(formData);
    }

    alert('저장 완료');
    router.push('/memo');
  } catch (e) {
    alert('저장 실패');
  }
};

const deleteMemo = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await MemoHttpService.deleteById(memo.value.id);
    alert('삭제 완료');
    router.push('/memo');
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
    await fetchMemoList();
  } else {
    setMode('view');
    await fetchMemo(routeId.value);
  }
});
</script>

<template>
  <div class="memo-detail-container">
    <h2>{{ isCreateMode ? '메모 작성' : isEditMode ? '메모 수정' : '메모 보기' }}</h2>

    <div class="input-section">
      <label>제목</label>
      <input v-model="memo.memoName" :readonly="isViewMode" />
    </div>

    <div class="input-section">
      <label>내용</label>
      <textarea v-model="memo.memoContent" rows="10" :readonly="isViewMode"></textarea>
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
      <button v-if="isCreateMode" @click="saveMemo">등록</button>
      <button v-if="isEditMode" @click="saveMemo">수정 완료</button>
      <button v-if="isViewMode" @click="enableEdit">수정</button>
      <button v-if="isViewMode" @click="deleteMemo" class="btn-danger">삭제</button>
      <button @click="router.push('/memo')">뒤로</button>
    </div>

    <hr style="margin: 40px 0; border-top: 1px solid #ccc;" />
    <h3>메모 목록</h3>

    <div class="memo-list-section">
      <div v-if="memoList.length === 0" class="empty-message">
        등록된 메모가 없습니다.
      </div>
      <ul v-else class="memo-items">
        <li
          v-for="item in memoList"
          :key="item.id"
          class="memo-item"
          @click="goToMemoDetail(item.id)"
        >
          <strong>{{ item.memoName }}</strong>
          <span>{{ item.memoContent.slice(0, 50) }}...</span>
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