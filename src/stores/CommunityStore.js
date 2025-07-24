import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchPosts } from '@/services/community/communityService'; // ✅ 추가

export const usecommunityStore = defineStore('community', () => {
  const posts = ref([]);
  const search = ref('');
  const sortOption = ref('latest');
  const selectedPost = ref(null);
  const viewMode = ref('list'); // 'list' | 'detail' | 'edit' | 'write'
  const hasLiked = ref(false);

  // 게시글 목록 조회
  const loadPosts = async () => {
    try {
      const res = await fetchPosts();
      console.log('res:', res); // ← 확인 완료
      posts.value = res.data.content || res.data; // 구조에 따라 조정
    } catch (err) {
      console.error('게시글 목록 조회 실패', err);
    }
  };

  const filteredPosts = computed(() => {
    const query = search.value.trim().toLowerCase();
    if (!query) return posts.value;

    return posts.value.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.nickname?.toLowerCase().includes(query)
    );
  });

  const sortedPosts = computed(() => {
    const sorted = [...filteredPosts.value];
    return sortOption.value === 'like'
      ? sorted.sort((a, b) => b.like - a.like)
      : sorted.sort((a, b) => b.postId - a.postId);
  });

  const selectPost = (post) => {
    selectedPost.value = post;
  };

  const clearPost = () => {
    selectedPost.value = null;
  };

  const goList = () => {
    clearPost();
    viewMode.value = 'list';
  };

  const goDetail = (post) => {
    if (post) {
      selectPost(post); // 리스트에서 클릭 시
    }
    viewMode.value = 'detail';
  };

  const goEdit = () => {
    viewMode.value = 'edit';
  };

  const goWrite = () => {
    clearPost();
    viewMode.value = 'write';
  };

  const replacePost = (updatedPost) => {
    const index = posts.value.findIndex((p) => p.postId === updatedPost.postId);
    if (index !== -1) {
      posts.value[index] = updatedPost;
    }
  };

  return {
    posts,
    search,
    sortOption,
    selectedPost,
    filteredPosts,
    sortedPosts,
    selectPost,
    clearPost,
    viewMode,
    goList,
    goDetail,
    goEdit,
    goWrite,
    loadPosts,

    replacePost,
  };
});
