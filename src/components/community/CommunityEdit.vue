<script setup>
import { ref, computed } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';

const store = usecommunityStore();
const post = computed(() => store.selectedPost || {});

// 수정 중인 값들을 로컬 상태로 복사
const editedTitle = ref(post.value.title);
const editedContent = ref(post.value.content);

// 저장 핸들러
function saveChanges() {
  // 실제 API 연동 전: store에 반영만 예시
  post.value.title = editedTitle.value;
  post.value.content = editedContent.value;

  store.goDetail(post.value); // 저장 후 상세보기로 이동
}

// 취소 핸들러
function cancelEdit() {
  store.goDetail(post.value);
}
</script>

<template>
  <v-container class="pa-6" fluid>
    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <v-card-text>
        <h2 class="mb-6 font-weight-bold text-h5">게시글 수정</h2>

        <v-text-field
          v-model="editedTitle"
          label="제목"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          clearable
        />

        <v-textarea
          v-model="editedContent"
          label="내용"
          variant="outlined"
          auto-grow
          rows="6"
          clearable
        />

        <div class="d-flex justify-end mt-6">
          <v-btn
            color="primary"
            variant="flat"
            class="mr-2"
            @click="saveChanges"
          >
            저장
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="cancelEdit">
            취소
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
