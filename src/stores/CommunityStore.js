import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const usecommunityStore = defineStore('community', () => {
  const posts = ref([
    {
      nickname: '교동 불주먹',
      time: '1시간 전',
      title: '오늘 점메추 가능하신분',
      likes: 3,
      comments: 2,
      thumbnail: '',
      ments: [],
    },
    {
      nickname: '사나이',
      time: '2시간 전',
      title: '오늘밤 주인공은 나야나',
      likes: 5,
      comments: 1,
      thumbnail: '',
      ments: [],
    },
    {
      nickname: '요아정 맛있어',
      time: '5시간 전',
      title: '오늘 간식은 요아정임',
      likes: 1,
      comments: 4,
      thumbnail: '',
      ments: [],
    },
  ]);

  const search = ref('');
  const sortOption = ref('latest');
  const selectedPost = ref(null);

  const filteredPosts = computed(() => {
    const text = search.value.trim().toLowerCase();
    if (!text) return posts.value;
    return posts.value.filter(
      (post) =>
        post.title.toLowerCase().includes(text) ||
        post.nickname.toLowerCase().includes(text)
    );
  });

  const sortedPosts = computed(() => {
    const sorted = [...filteredPosts.value];
    return sortOption.value === 'likes'
      ? sorted.sort((a, b) => b.likes - a.likes)
      : sorted;
  });

  const selectPost = (post) => {
    selectedPost.value = post;
  };

  const clearPost = () => {
    selectedPost.value = null;
  };

  const viewMode = ref('list');

  const goList = () => {
    clearPost();
    viewMode.value = 'list';
  };

  const goDetail = (post) => {
    selectPost(post);
    viewMode.value = 'detail';
  };

  const goEdit = () => {
    viewMode.value = 'edit';
  };

  const goWrite = () => {
    clearPost();
    viewMode.value = 'write';
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
  };
});
