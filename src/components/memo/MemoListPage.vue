<script setup>
import { ref } from 'vue';
import MemoDetail from '@/components/memo/MemoDetail.vue';
import MemoList from '@/components/memo/MemoList.vue';

const selectedMemo = ref(null);
const mode = ref('create'); // 'create' | 'view' | 'edit'

const memoListRef = ref(null); // MemoList를 참조할 ref

const handleSelect = (memo) => {
  selectedMemo.value = memo;
  mode.value = 'view';
};

const handleClear = () => {
  selectedMemo.value = null;
  mode.value = 'create';
};

const refreshList = () => {
  memoListRef.value?.fetchMemos(); // MemoList에서 expose된 메서드 호출
};
</script>

<template>
  <div class="memo-list-page">
    <!-- 메모 등록/수정/조회 -->
    <MemoDetail
      :mode="mode"
      :memo-prop="selectedMemo"
      @cancel="handleClear"
      @updated="handleClear"
      @created="() => { handleClear(); refreshList(); }"
    />

    <!-- 메모 목록 -->
    <MemoList ref="memoListRef" @select="handleSelect" />
  </div>
</template>

<style scoped>
.memo-list-page {
  display: flex;
  flex-direction: column;
  gap: 60px;
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
}
</style>