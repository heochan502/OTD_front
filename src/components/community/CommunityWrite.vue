<script setup>
import { ref } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';

const store = usecommunityStore();

// 작성 중인 게시글 상태
const title = ref('');
const content = ref('');

// 작성 완료 버튼 핸들러
function submitPost() {
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  const newPost = {
    nickname: '새 유저',
    time: '방금 전',
    title: title.value,
    content: content.value,
    likes: 0,
    comments: 0,
    thumbnail: '',
    ments: [],
  };

  store.posts.unshift(newPost);
  store.goList(); // 글 등록 후 목록으로 이동
}

// 취소 버튼
function cancelWrite() {
  store.goList();
}
</script>

<template>
  <v-container class="pa-6" fluid>
    <v-card class="mx-auto" max-width="800" elevation="2" rounded="lg">
      <v-card-text>
        <h2 class="mb-6 font-weight-bold text-h5">글쓰기</h2>

        <v-text-field
          v-model="title"
          label="제목"
          variant="outlined"
          density="comfortable"
          class="mb-4"
          clearable
        />

        <v-textarea
          v-model="content"
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
            @click="submitPost"
          >
            등록
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="cancelWrite">
            취소
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
