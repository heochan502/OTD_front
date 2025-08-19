<script setup>
import { ref, onMounted } from "vue";
import { useAccountStore } from "@/stores/counter";
import MemoHttpService from "@/services/memo/MemoHttpService";

const memoList = ref([]);
const emit = defineEmits(["select"]);
const accountStore = useAccountStore();

const fetchMemoList = async () => {
  console.log("[memoList] 로그인된 유저 ID:", accountStore.loggedInId);
  const params = {
    currentPage: 1,
    pageSize: 100,
    memberNoLogin: accountStore.loggedInId,
  };
  try {
    const result = await MemoHttpService.findAll(params);
    console.log("[memoList] 서버 응답:", result);
    memoList.value = result.memoList || result.memolist || [];
  } catch (e) {
    console.error("❌ 메모 목록 조회 중 오류:", e);
    memoList.value = [];
  }
};

onMounted(fetchMemoList);
defineExpose({ fetchMemoList });

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};
</script>

<template>
  <div class="memo-list">
    <div
      v-for="memo in memoList"
      :key="memo.id"
      class="memo-item"
      @click="$emit('select', memo)"
    >
      <div class="memo-content">
        <h3>{{ memo.memoName }}</h3>
        <p>{{ memo.memoContent }}</p>
        <span class="date">{{ formatDate(memo.createdAt) }}</span>
      </div>
      <img
        v-if="memo.memoImageFileName"
        :src="`/pic/${memo.memoImageFileName}`"
        class="preview-image"
        alt="memo"
      />
    </div>

    <div v-if="memoList.length === 0" class="empty-message">
      등록된 메모가 없습니다.
    </div>
  </div>
</template>

<style scoped>
:root {
  --color-primary: #50c3f7;
  --color-text-dark: #000;
  --color-gray-ccc: #ccc;
  --color-gray-eee: #eee;
  --color-red-danger: #dc3545;
  --color-red-danger-hover: #c82333;
  --spacing-sm: 5px;
  --spacing-md: 24px;
  --spacing-lg: 20px;
  --border-radius-base: 8px;
  --shadow-light: rgba(0, 0, 0, 0.08);
}

/* === 공통 wrapper (디테일/리스트 공용) === */
.memo-detail,
.diary-detail,
.memo-list,
.diary-list {
  max-width: 800px;
  margin: var(--spacing-lg) auto;
  padding: var(--spacing-lg);
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px var(--shadow-light);
  color: var(--color-text-dark);
}

/* === 제목 === */
.memo-detail h2,
.diary-detail h2 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: var(--spacing-md);
}

/* === 라벨 === */
.memo-detail label,
.diary-detail label {
  display: block;
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  font-weight: bold;
  font-size: 1.2rem;
}

/* === 인풋 필드 (제목, 기분 등) === */
.text-input {
  width: 720px;
  height: 50px;
  font-size: 1.1rem;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-gray-ccc);
  border-radius: var(--border-radius-base);
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  box-sizing: border-box;
}

/* === 텍스트에어리어 (내용 입력) === */
.textarea {
  width: 720px;
  height: 350px;
  font-size: 1rem;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-gray-ccc);
  border-radius: var(--border-radius-base);
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  resize: vertical;
  box-sizing: border-box;
}

/* === 파일 업로드 === */
input[type="file"] {
  width: 720px;
  padding: var(--spacing-sm) var(--spacing-md);
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--color-gray-ccc);
  border-radius: var(--border-radius-base);
  box-sizing: border-box;
}

/* === 이미지 미리보기 === */
.preview-container {
  position: relative;
  display: inline-block;
  margin-right: 10px;
}

.preview-list {
  width: 720px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  background-color: var(--color-gray-eee);
  border-radius: var(--border-radius-base);
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius-base);
}

.remove-btn {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 24px;
  height: 24px;
  background-color: var(--color-red-danger);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background-color: var(--color-red-danger-hover);
}

/* === 버튼 그룹 === */
.button-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.button-group button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: var(--border-radius-base);
  cursor: pointer;
  border: none;
  background-color: var(--color-primary);
  color: white;
  transition: background-color 0.2s ease;
}

.button-group button:hover {
  opacity: 0.9;
}

/* === 리스트 아이템 (내용 좌측, 이미지 우측 정렬) === */
.memo-item,
.diary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f5f5f5;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-base);
  box-shadow: 0 2px 8px var(--shadow-light);
  margin-bottom: var(--spacing-md);
}

.memo-content,
.diary-content {
  flex: 1;
}

/* === 리스트 아이템 간격 === */
.memo-list > .memo-item + .memo-item,
.diary-list > .diary-item + .diary-item {
  margin-top: var(--spacing-md);
}

/* === 리스트 내부 이미지 미리보기 === */
.preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: var(--border-radius-base);
  margin-left: var(--spacing-md);
}

/* === 작성일 표시 === */
.date {
  font-size: 0.9rem;
  color: #888;
}

/* === 비어있을 때 메시지 === */
.empty-message {
  text-align: center;
  color: #999;
  margin-top: 20px;
}

/* === 📱 모바일 반응형 대응 === */
@media (max-width: 768px) {
  .memo-detail,
  .diary-detail,
  .memo-list,
  .diary-list {
    padding: 16px;
  }

  .text-input,
  .textarea,
  input[type="file"],
  .preview-list {
    width: 100%;
  }

  .memo-item,
  .diary-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .diary-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .diary-text {
    flex: 1;
    padding-right: 16px;
  }

  .diary-image-wrapper {
    flex-shrink: 0;
  }
  .preview-image {
    width: 100px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
  }

  .mood-options {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  .mood-button {
    padding: 10px 16px;
    border-radius: 8px;
    border: 1px solid var(--color-gray-ccc);
    background-color: #fff;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .mood-button.selected {
    background-color: var(--color-primary);
    color: white;
    font-weight: bold;
  }

  .hidden-radio {
    display: none;
  }

  .mood-button:has(input[value=""]) {
    font-style: italic;
    color: var(--color-gray-ccc);
  }
}
</style>
