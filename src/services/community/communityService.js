import axios from 'axios';

// baseURL 앞에 반드시 '/' 포함
axios.defaults.baseURL = '/api/OTD/';

const COMMUNITY_BASE = 'community/';

// 게시글 목록 조회
export const fetchPosts = (page = 1, size = 10, searchText = '') => {
  return axios.get(`${COMMUNITY_BASE}list`, {
    params: { page, size, searchText },
  });
};

// 게시글 상세 조회
export const fetchPostById = (postId) => {
  return axios.get(`${COMMUNITY_BASE}detail/${postId}`);
};

// 게시글 작성 (파일 포함)
export const createPost = (formData) => {
  return axios.post(`${COMMUNITY_BASE}create`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 게시글 수정
export const updatePost = (postId, formData) => {
  return axios.put(`${COMMUNITY_BASE}update/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 게시글 삭제
export const deletePost = (postId) => {
  return axios.delete(`${COMMUNITY_BASE}delete/${postId}`);
};

// 게시글 검색
export const searchPosts = (keyword, page = 1, size = 20) => {
  return axios.get(`${COMMUNITY_BASE}search`, {
    params: { keyword, page, size },
  });
};

// 좋아요 등록 또는 취소
export const toggleLike = (postId) => {
  return axios.post(`${COMMUNITY_BASE}like/${postId}`);
};
