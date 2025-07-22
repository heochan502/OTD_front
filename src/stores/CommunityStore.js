// 커뮤니티 폴더 안에서 컴포넌트간의 상태 관리를 위한 파일
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommunityStore = defineStore('community', () => {
  const selectedPost = ref(null);

  function selectPost(post) {
    selectedPost.value = post;
  }

  function clearPost() {
    selectedPost.value = null;
  }

  return {
    selectedPost,
    selectPost,
    clearPost,
  };
});
