<script setup>
import { ref, onMounted, nextTick, computed, reactive } from 'vue';
import { useAccountStore } from '@/stores/counter';
import MemoHttpService from '@/services/memo/MemoHttpService';
import { useMemoDetail } from './useMemoDetail';

const accountStore = useAccountStore();

// useMemoDetail이 props.memoProp을 watch하므로 reactive props 준비
const props = reactive({ memoProp: null });

// useMemoDetail이 emit('created' | 'updated' | 'deleted' | 'cancel') 호출함 → 핸들러 매핑
const memoList = ref([]);
const memoListLoading = ref(false);

const fetchMemoList = async () => {
  memoListLoading.value = true;
  try {
    const params = { currentPage: 1, pageSize: 100, memberNoLogin: accountStore.state.memberNoLogin };
    const result = await MemoHttpService.findAll(params);
    memoList.value = result.memoList || result.memolist || [];
  } catch (e) {
    console.error("❌ 메모 목록 조회 중 오류:", e);
    memoList.value = [];
  } finally {
    memoListLoading.value = false;
  }
};

const afterMutate = async () => {
  await fetchMemoList();
  props.memoProp = null;
  setMode('create');
  await nextTick();
  clearPreviewImages();
};

// useMemoDetail 훅 사용 (이 부분은 거의 그대로!)
const emit = (event) => {
  if (event === 'created' || event === 'updated' || event === 'deleted') {
    afterMutate();
  } else if (event === 'cancel') {
    props.memoProp = null;
    setMode('create');
    clearPreviewImages();
  }
};

const {
  memo,
  previewImages,
  fileInputRef,
  isCreateMode,
  isEditMode,
  isViewMode,
  isTitleValid,
  isContentValid,
  setMode,
  handleImageChange,
  removeImage,
  createMemo,
  updateMemo,
  deleteMemo,
  cancelEdit,
  clearPreviewImages,
} = useMemoDetail(props, emit);

const titleText = computed(() => {
  if (isCreateMode.value) return '메모 등록';
  if (isEditMode.value) return '메모 수정';
  return '메모 보기';
});

// 목록에서 아이템 클릭 → 상단 폼에 바인딩 (view 모드)
const handleSelect = (m) => {
  props.memoProp = m;     // 훅의 watch가 받아서 view 모드로 셋업
  setMode('view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(fetchMemoList);

// 날짜 포맷
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
</script>

<template>
  <div class="memo-list-page">
    <!-- 상단: 폼 -->
    <div class="memo-detail">
      <h2 class="memo-title">{{ titleText }}</h2>

      <label for="memoName" class="memo-label">제목</label>
      <input id="memoName" v-model="memo.memoName" class="memo-input" />
      <p v-if="memo.memoName.length > 0 && !isTitleValid" class="memo-error">
        제목은 5자 이상 입력해주세요.
      </p>

      <label for="memoContent" class="memo-label">내용</label>
      <textarea id="memoContent" v-model="memo.memoContent" class="memo-textarea" />
      <p v-if="memo.memoContent.length > 0 && !isContentValid" class="memo-error">
        내용은 10자 이상 입력해주세요.
      </p>

      <label class="memo-label">이미지</label>

      <!-- 기존 저장 이미지 -->
      <div v-if="memo.memoImage && previewImages.length === 0" class="memo-preview-list">
        <div class="memo-preview-item">
          <img :src="`/pic/${memo.memoImage}`" alt="등록된 이미지" />
        </div>
      </div>

      <!-- 미리보기 -->
      <div v-if="previewImages.length > 0" class="memo-preview-list">
        <div v-for="(img, idx) in previewImages" :key="idx" class="memo-preview-item">
          <img :src="img" alt="미리보기 이미지" />
          <button v-if="!isViewMode" @click="removeImage(idx)" class="memo-remove-btn">삭제</button>
        </div>
      </div>

      <input
        v-if="!isViewMode"
        ref="fileInputRef"
        type="file"
        accept="image/*"
        @change="handleImageChange"
        class="memo-file-input"
      />

      <div class="memo-button-group">
        <button
          v-if="isCreateMode"
          :disabled="!isTitleValid || !isContentValid"
          @click="createMemo"
        >
          등록
        </button>

        <template v-else-if="isEditMode">
          <button :disabled="!isTitleValid || !isContentValid" @click="updateMemo">수정 완료</button>
          <button @click="cancelEdit">취소</button>
        </template>

        <template v-else>
          <button @click="setMode('edit')">수정</button>
          <button @click="deleteMemo">삭제</button>
          <button @click="cancelEdit">목록</button>
        </template>
      </div>
    </div>

    <!-- 하단: 목록 -->
    <div class="memo-list-wrapper">
      <h3 class="memo-list-heading">메모 목록</h3>

      <div v-if="memoListLoading" class="memo-list-empty">불러오는 중...</div>

      <template v-else>
        <div
          v-for="m in memoList"
          :key="m.memoId"
          class="memo-list-item"
          @click="handleSelect(m)"
        >
          <div class="memo-list-text">
            <h4 class="memo-list-title">{{ m.memoName }}</h4>
            <p class="memo-list-content">{{ m.memoContent }}</p>
            <span class="memo-list-date">{{ formatDate(m.createdAt) }}</span>
          </div>
          <img
            v-if="m.memoImage"
            :src="`/pic/${m.memoImage}`"
            class="memo-list-image"
            alt="memo"
            @error="e => e.target.style.display = 'none'"
          />
        </div>

        <div v-if="memoList.length === 0" class="memo-list-empty">
          등록된 메모가 없습니다.
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.memo-list-page { max-width: 900px; margin: 20px auto; }

/* 상단 폼 스타일 */
.memo-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  color: #000;
}
.memo-title { font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 24px; }
.memo-label { display: block; margin-top: 20px; margin-bottom: 5px; font-weight: bold; font-size: 1.2rem; }
.memo-input, .memo-textarea, .memo-file-input {
  width: 100%; font-size: 1.1rem; padding: 5px 24px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 24px; box-sizing: border-box;
}
.memo-textarea { height: 350px; resize: vertical; }
.memo-preview-list { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px; }
.memo-preview-item { width: 120px; height: 120px; position: relative; background-color: #eee; border-radius: 8px; overflow: hidden; }
.memo-preview-item img { width: 100%; height: 100%; object-fit: cover; }
.memo-remove-btn {
  position: absolute; top: 5px; right: 5px; width: 24px; height: 24px;
  background-color: #dc3545; color: white; border: none; border-radius: 50%; font-weight: bold; cursor: pointer;
}
.memo-error { color: #dc3545; font-size: 0.9rem; margin-top: -16px; margin-bottom: 12px; }

/* 하단 목록 스타일 */
.memo-list-wrapper {
  margin-top: 24px; padding: 20px; background-color: #f9f9f9;
  border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); color: #000;
}
.memo-list-heading { margin: 0 0 16px; font-size: 1.25rem; font-weight: 700; }
.memo-list-item {
  display: flex; justify-content: space-between; align-items: flex-start;
  background: #f5f5f5; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 16px; cursor: pointer; transition: background-color 0.2s ease;
}
.memo-list-item:hover { background-color: #f0f0f0; }
.memo-list-text { flex: 1; }
.memo-list-title { font-size: 1.1rem; margin: 0 0 8px; font-weight: 700; }
.memo-list-content { font-size: 1rem; margin: 0 0 10px; color: #333; }
.memo-list-date { font-size: 0.9rem; color: #888; }
.memo-list-image { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; margin-left: 24px; }
.memo-list-empty { text-align: center; color: #999; margin-top: 12px; font-style: italic; }

@media (max-width: 768px) {
  .memo-list-item { flex-direction: column; align-items: flex-start; }
  .memo-list-image { width: 100%; height: auto; margin-left: 0; margin-top: 12px; }
}
</style>
