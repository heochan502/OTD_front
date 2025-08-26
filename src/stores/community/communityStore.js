import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  fetchPosts,
  fetchPostById,
} from '@/services/community/communityService';

export const usecommunityStore = defineStore('community', () => {
  const posts = ref([]);
  const search = ref('');
  const sortOption = ref('latest');
  const selectedPost = ref(null);
  const viewMode = ref('list'); // 'list' | 'detail' | 'edit' | 'write'
  const hasLiked = ref(false);
  const page = ref(1);
  const totalCount = ref(0);

  // 게시글 목록 조회
  const loadPosts = async (page = 1) => {
    try {
      const res = await fetchPosts(page, 10);

      const allPosts = res.data.posts || res.data.content || [];

      posts.value = allPosts.filter(
        (post) => post.isDeleted === false || post.isDeleted === 0
      );

      totalCount.value = res.data.totalCount || res.data.total || 0;
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

  const clearSelectedPost = () => {
    selectedPost.value = null;
  };

  const goList = () => {
    clearSelectedPost();
    viewMode.value = 'list';
  };

  const goDetail = async (post) => {
    if (!post?.postId) return;
    try {
      const res = await fetchPostById(post.postId);
      selectedPost.value = res.data;
      viewMode.value = 'detail';
    } catch (err) {
      console.error('상세 조회 실패:', err);
    }
  };

  const goEdit = () => {
    viewMode.value = 'edit';
  };

  const goWrite = () => {
    clearSelectedPost();
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
    clearSelectedPost,
    viewMode,
    goList,
    goDetail,
    goEdit,
    goWrite,
    loadPosts,
    replacePost,
    totalCount,
  };
});
