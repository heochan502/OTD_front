import { defineStore } from 'pinia';
import { fetchMents, createMent, deleteMent } from '@/stores/mentStore';

export const useMentStore = defineStore('ment', () => {
  const ments = ref([]);

  const loadMents = async (postId) => {
    const res = await fetchMents(postId);
    ments.value = res.data;
  };

  const addMent = async (postId, content) => {
    await createMent(postId, content);
    await loadMents(postId);
  };

  const removeMent = async (commentId, postId) => {
    await deleteMent(commentId);
    await loadMents(postId);
  };

  return { ments, loadMents, addMent, removeMent };
});
