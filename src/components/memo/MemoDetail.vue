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
  hasNoImages,
  imageCount,
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
      pageSize: state.pageSize,
    });
    state.memoList = result.memoList;
    state.totalMemos = result.totalCount;
  } catch {
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
  if (route.params.id !== id) router.push(`/memoAndDiary/memo/${id}`);
};

const saveMemo = async () => {
  if (!memo.value.memoName?.trim() || !memo.value.memoContent?.trim()) {
    alert('제목과 내용을 모두 입력하세요.');
    return;
  }

  try {
    const files = Array.from(fileInputRef.value?.files || []);

    if (isEditMode.value) {
      const formData = new FormData();
      formData.append(
        'memoData',
        new Blob([
          JSON.stringify({
            id: memo.value.id,
            memoName: memo.value.memoName,
            memoContent: memo.value.memoContent,
            memoImage: memo.value.imageFileName,
          }),
        ], { type: 'application/json' })
      );
      files.forEach((f) => formData.append('memoImageFiles', f));
      await MemoHttpService.modify(formData);
    } else {
      const formData = new FormData();
      formData.append(
        'memoData',
        new Blob([
          JSON.stringify({
            memoName: memo.value.memoName,
            memoContent: memo.value.memoContent,
          }),
        ], { type: 'application/json' })
      );
      files.forEach((f) => formData.append('memoImageFiles', f));
      await MemoHttpService.create(formData);
    }

    alert('저장 완료');
    state.currentPage = 1;
    await fetchMemoList();
    router.push('/memoAndDiary/memo');
  } catch {
    alert('저장 실패');
  }
};

const deleteMemo = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await MemoHttpService.deleteById(memo.value.id);
    alert('삭제 완료');
    state.currentPage = 1;
    await fetchMemoList();
    router.push('/memoAndDiary/memo');
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
    await fetchMemoList();
  }
});
</script>

<template>
  <div class="memo-wrapper">
    <div class="memo-detail">
      <h2>메모</h2>

      <label for="memoName">제목</label>
      <input
        id="memoName"
        type="text"
        v-model="memo.memoName"
      />

      <label for="memoContent">내용</label>
      <textarea
        id="memoContent"
        v-model="memo.memoContent"
        rows="10"
      />

      <label for="imageUpload">이미지 업로드 (최대 5장)</label>
      <input
        id="imageUpload"
        type="file"
        ref="fileInputRef"
        accept=".jpg, .jpeg, .png, .gif"
        multiple
        @change="handleImageChange"
        :disabled="isViewMode"
      />

      <div class="preview-list">
        <div
          v-for="(img, index) in previewImages"
          :key="index"
          class="preview-item"
        >
          <img v-if="img" :src="img" />
          <button
            v-if="!isViewMode"
            @click="removeImage(index)"
            class="remove-btn"
          >
            X
          </button>
        </div>
        <p v-if="hasNoImages" class="empty-message">등록된 이미지가 없습니다.</p>
        <p
          v-else-if="typeof imageCount === 'number' && imageCount >= 5"
          class="empty-message"
        >
          이미지는 최대 5장까지 등록할 수 있습니다.
        </p>
      </div>

      <div class="button-group">
        <button v-if="isCreateMode" @click="saveMemo">등록</button>
        <button v-if="isEditMode" @click="saveMemo">수정 완료</button>
        <button v-if="isViewMode" @click="enableEdit">수정</button>
        <button v-if="isViewMode" @click="deleteMemo" class="btn-danger">
          삭제
        </button>
        <button @click="router.push('/memoAndDiary/memo')">뒤로</button>
      </div>

      <div class="memo-list" v-if="!isCreateMode">
        <h3>전체 메모 목록</h3>
        <div v-if="state.memoList.length === 0" class="empty-message">
          등록된 메모가 없습니다.
        </div>
        <ul class="memo-items" v-else>
          <li
            v-for="item in state.memoList"
            :key="item.id"
            class="memo-item"
            @click="goToMemoDetail(item.id)"
          >
            <div class="memo-title">{{ item.memoName }}</div>
            <div class="memo-content">{{ item.memoContent }}</div>
            <div class="memo-date">{{ formatDateTime(item.createdAt) }}</div>
          </li>
        </ul>

        <div class="pagination">
          <button
            @click="changePage(state.currentPage - 1)"
            :disabled="state.currentPage <= 1"
          >
            이전
          </button>
          <span>{{ state.currentPage }} / {{ totalPages }}</span>
          <button
            @click="changePage(state.currentPage + 1)"
            :disabled="state.currentPage >= totalPages"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>