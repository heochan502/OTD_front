<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { usecommunityStore } from '@/stores/communityStore';
import {
  updatePost,
  fetchPostById,
} from '@/services/community/communityService';

const store = usecommunityStore();
const post = computed(() => store.selectedPost || {});

// 수정 중인 값들을 로컬 상태로 복사
const editedTitle = ref(post.value.title);
const editedContent = ref(post.value.content);

onMounted(async () => {
  if (post.value) {
    likeCount.value = post.value.like;
    isLiked.value = post.value.likedByCurrentUser;
  }
});

watch(post, (newPost) => {
  editedTitle.value = newPost.title;
  editedContent.value = newPost.content;
});

// 수정한 값을 저장하는 핸들러
const saveChanges = async () => {
  if (!post.value.postId) return;

  try {
    const formData = new FormData();
    formData.append('title', editedTitle.value);
    formData.append('content', editedContent.value);

    await updatePost(post.value.postId, formData);

    const res = await fetchPostById(post.value.postId);
    store.selectPost(res.data);
    store.goDetail(res.data);

    alert('수정이 완료되었습니다.');
  } catch (err) {
    console.error('수정 실패:', err);
    alert('수정 중 오류가 발생했습니다.');
  }
};

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
