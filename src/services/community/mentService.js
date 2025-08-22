// src/services/community/mentService.js
import axios from 'axios';

//공통 베이스 URL
axios.defaults.baseURL = '/api/OTD/';

//세션 쿠키(로그인) 전달
axios.defaults.withCredentials = true;

const COMMENT_BASE = 'community/comment/';

// 댓글 목록 조회
export const fetchMents = (postId) => {
  return axios.get(`${COMMENT_BASE}${postId}`);
};

// 댓글 등록
export const createMent = (payload) => {
  return axios.post(`${COMMENT_BASE}create`, payload);
};

// 댓글 삭제
export const deleteMent = (commentId) => {
  return axios.delete(`${COMMENT_BASE}delete/${commentId}`);
};
