<script setup>
import { ref, nextTick } from 'vue';
import MemoDetail from '@/components/memo/MemoDetail.vue';
import MemoList from '@/components/memo/MemoList.vue';

const selectedMemo = ref(null);
const mode = ref('create'); // 'create' | 'view' | 'edit'

const memoListRef = ref(null);
const memoDetailRef = ref(null);

const handleCreated = async () => {
  handleClear();
  await memoListRef.value?.fetchMemoList();
};

const handleSelect = (memo) => {
  selectedMemo.value = memo;
  mode.value = 'view';
};

const handleClear = () => {
  selectedMemo.value = null;
  mode.value = 'create';
};

const handleDeleted = async () => {
  selectedMemo.value = null;
  mode.value = 'create';
  await nextTick();
  memoDetailRef.value?.clearForm?.();
  await memoListRef.value?.fetchMemoList();
};

const handleUpdated = async () => {
  handleClear();
  await memoListRef.value?.fetchMemoList();
};
</script>

<template>
  <div class="memo-list-page">
    <MemoDetail
      ref="memoDetailRef"
      :mode="mode"
      :memo-prop="selectedMemo"
      @created="handleCreated"
      @updated="handleUpdated"
      @deleted="handleDeleted"
      @cancel="handleClear"
    />

    <MemoList ref="memoListRef" @select="handleSelect" />
  </div>
</template>