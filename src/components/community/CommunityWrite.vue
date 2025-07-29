<script setup>
import { ref } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';
import { useAccountStore } from '@/stores/counter';
import axios from 'axios';
import { createPost } from '@/services/community/communityService';

const store = usecommunityStore();
const account = useAccountStore();

// 작성 중인 게시글 상태
const title = ref('');
const content = ref('');

const submitPost = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 모두 입력해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('content', content.value);
  formData.append('memberNoLogin', account.loggedInId); // 로그인 유저 번호

  try {
    const res = await createPost(formData); // 서비스 함수 사용
    console.log('글 등록 성공', res.data);
    store.goList();
  } catch (err) {
    console.error('글 등록 실패', err);
    alert('글 등록에 실패했습니다.');
  }
};

const cancelWrite = () => {
  store.goList();
};
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
