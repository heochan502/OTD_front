import axios from 'axios';

export const fetchMents = (postId) => axios.get(`/api/OTD/comment/${postId}`);

export const createMent = (postId, content) =>
  axios.post(`/api/OTD/comment/${postId}`, { content });

export const deleteMent = (commentId) =>
  axios.delete(`/api/OTD/comment/${commentId}`);
