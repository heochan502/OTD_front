<script setup>
import { ref, onMounted, nextTick, computed, reactive } from 'vue';
import { useAccountStore } from '@/stores/counter';
import DiaryHttpService from '@/services/memo/DiaryHttpService';
import { useDiaryDetail, MOOD_OPTIONS } from './useDiaryDetail';

const accountStore = useAccountStore();

const props = reactive({ diaryProp: null });

// 훅 사용 (기존 로직 유지: emit 이벤트만 받아서 페이지에서 처리)
const emit = async (event) => {
  if (event === 'created' || event === 'updated' || event === 'deleted') {
    await afterMutate();
  } else if (event === 'cancel') {
    handleClear();
  }
};

const {
  diary,
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
  createDiary,
  updateDiary,
  deleteDiary,
  cancelEdit,
  clearForm,
  fetchDiary,
  setDiaryProp,
} = useDiaryDetail(props, emit);

// 목록 상태
const diaryList = ref([]);
const diaryListLoading = ref(false);

// 목록 조회
const fetchDiaryList = async () => {
  diaryListLoading.value = true;
  try {
    const params = {
      currentPage: 1,
      pageSize: 5,
      memberNoLogin: accountStore.state.memberNoLogin,
    };
    const result = await DiaryHttpService.findAll(params);
    diaryList.value = result?.diaryList || [];
  } catch (err) {
    console.error('다이어리 목록 조회 실패:', err);
    diaryList.value = [];
  } finally {
    diaryListLoading.value = false;
  }
};

// 생성/수정/삭제 후 공통 후처리
const afterMutate = async () => {
  await fetchDiaryList();
  handleClear();
  await nextTick();
};

// 리스트 항목 선택 → view 모드 + 훅에서 props.watch로 반영
const handleSelect = async (item) => {
  props.diaryProp = item;
  setMode('view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 취소/목록 버튼
const handleClear = () => {
  props.diaryProp = null;
  clearForm();
  setMode('create');
};

onMounted(fetchDiaryList);

// 제목 텍스트
const titleText = computed(() =>
  isCreateMode.value ? '다이어리 등록' : (isEditMode.value ? '다이어리 수정' : '다이어리 보기')
);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return isNaN(date) ? '' : date.toLocaleDateString();
};
</script>

<template>
  <div class="diary-list-page">
    <!-- 상단 폼 -->
    <div class="diary-detail">
      <h2 class="diary-title">{{ titleText }}</h2>

      <label for="diaryName" class="diary-label">제목</label>
      <input id="diaryName" v-model="diary.diaryName" placeholder="제목을 입력하세요" class="diary-input" />
      <p v-if="!isTitleValid && diary.diaryName !== ''" class="diary-error">제목은 5자 이상 입력해주세요.</p>

      <label for="diaryContent" class="diary-label">내용</label>
      <textarea id="diaryContent" v-model="diary.diaryContent" placeholder="내용을 입력하세요" class="diary-textarea" />
      <p v-if="!isContentValid && diary.diaryContent !== ''" class="diary-error">내용은 10자 이상 입력해주세요.</p>

      <label class="diary-label">기분</label>
      <div class="diary-mood-options">
        <label
          v-for="option in MOOD_OPTIONS"
          :key="option.value"
          :class="['diary-mood-button', { selected: diary.mood === option.value }]"
        >
          <input
            type="radio"
            :value="option.value"
            v-model="diary.mood"
            class="diary-radio-hidden"
            :disabled="option.value === ''"
          />
          {{ option.label }}
        </label>
      </div>

      <label class="diary-label">이미지</label>
      <div class="image-section">
        <input
          v-if="!isViewMode"
          ref="fileInputRef"
          type="file"
          accept="image/*"
          @change="handleImageChange"
          class="diary-file-input"
        />
        <div class="diary-preview-list">
          <div v-for="(img, idx) in previewImages" :key="idx" class="diary-preview-container">
            <img :src="img" class="diary-preview-image" />
            <button v-if="!isViewMode" @click="removeImage(idx)" class="diary-remove-btn">X</button>
          </div>
          <p v-if="previewImages.length === 0" class="diary-empty-message">선택된 이미지가 없습니다.</p>
        </div>
      </div>

      <div class="diary-button-group">
        <button v-if="isCreateMode" @click="createDiary" :disabled="!isTitleValid || !isContentValid">등록</button>

        <template v-else-if="isEditMode">
          <button @click="updateDiary" :disabled="!isTitleValid || !isContentValid">수정 완료</button>
          <button @click="cancelEdit">취소</button>
          <button @click="deleteDiary" class="diary-delete-btn">삭제</button>
        </template>

        <template v-else>
          <button @click="setMode('edit')">수정</button>
          <button @click="cancelEdit">목록</button>
        </template>
      </div>
    </div>

    <!-- 하단: 목록 -->
    <div class="diary-list">
      <div v-if="Array.isArray(diaryList) && diaryList.length > 0">
        <div
          v-for="diary in diaryList"
          :key="diary.diaryId"
          class="diary-item"
          @click="handleSelect(diary)"
        >
          <div class="diary-item-content">
            <div class="diary-text">
              <h3>{{ diary.diaryName }}</h3>
              <p>{{ diary.diaryContent }}</p>
              <span class="diary-date">{{ formatDate(diary.createdAt) }}</span>
            </div>
            <div class="diary-image-wrapper" v-if="diary.diaryImage">
              <img
               :src="`/api/OTD/memoAndDiary/diary/image/${diary.diaryImage}`"
                class="diary-preview-image"
                alt="다이어리 이미지"
                @error="e => console.error('❌ 이미지 로딩 실패:', e.target.src)"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="diary-empty-message">
        등록된 다이어리가 없습니다.
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-list-page { max-width: 900px; margin: 20px auto; }

/* ===== 상단 폼 ===== */
.diary-detail {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  color: #000;
}
.diary-title { font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 24px; }
.diary-label { display: block; margin-top: 20px; margin-bottom: 5px; font-weight: bold; font-size: 1.2rem; }
.diary-input, .diary-textarea, .diary-file-input {
  width: 100%; font-size: 1.1rem; padding: 5px 24px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 24px; box-sizing: border-box;
}
.diary-textarea { height: 350px; resize: vertical; }
.diary-mood-options { display: flex; gap: 10px; margin-top: 10px; }
.diary-mood-button { padding: 10px 16px; border-radius: 8px; border: 1px solid #ccc; background-color: #fff; cursor: pointer; transition: background-color 0.2s; }
.diary-mood-button.selected { background-color: #50C3F7; color: white; font-weight: bold; }
.diary-radio-hidden { display: none; }
.diary-preview-list { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
.diary-preview-container { position: relative; width: 120px; height: 120px; }
.diary-preview-image { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 1px solid #ccc; }
.diary-remove-btn { position: absolute; top: -8px; right: -8px; background-color: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; font-weight: bold; cursor: pointer; }
.diary-empty-message { color: #aaa; font-style: italic; margin-top: 10px; }
.diary-button-group { display: flex; gap: 10px; margin-top: 24px; justify-content: center; }
.diary-button-group button { padding: 10px 20px; font-size: 1rem; border-radius: 8px; border: none; cursor: pointer; background-color: #50C3F7; color: white; transition: background-color 0.2s; }
.diary-button-group button:disabled { background-color: #ccc; cursor: not-allowed; }
.diary-button-group .diary-delete-btn { background-color: #dc3545; }
.diary-error { color: #dc3545; font-size: 0.9rem; margin-top: -16px; margin-bottom: 12px; }

/* ===== 하단 목록 ===== */
.diary-list {
  max-width: 800px; margin: 20px auto; padding: 20px; background-color: #f9f9f9;
  border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); color: #000;
}
.diary-item {
  display: flex; justify-content: space-between; align-items: flex-start;
  background: #f5f5f5; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}
.diary-item-content { display: flex; align-items: flex-start; justify-content: space-between; width: 100%; }
.diary-text { flex: 1; padding-right: 16px; }
.diary-preview-image { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; margin-left: 24px; }
.diary-date { font-size: 0.9rem; color: #888; }
.diary-image-wrapper { flex-shrink: 0; }

@media (max-width: 768px) {
  .diary-list { padding: 16px; }
  .diary-item { flex-direction: column; align-items: flex-start; }
  .diary-preview-image { width: 100px; height: auto; border-radius: 8px; object-fit: cover; margin-left: 0; margin-top: 12px; }
  .diary-item-content { flex-direction: column; align-items: flex-start; }
}
</style>
