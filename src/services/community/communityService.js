import axios from 'axios';

// baseURL 앞에 반드시 '/' 포함
axios.defaults.baseURL = '/api/OTD/';

// [ADDED] 세션 쿠키(로그인) 전달을 위해 필요
axios.defaults.withCredentials = true;

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
// [CHANGED] Content-Type 헤더를 직접 지정하지 않음(FormData가 자동 처리)
export const createPost = (formData) => {
  return axios.post(`${COMMUNITY_BASE}create`, formData);
};

// 게시글 수정
// [CHANGED] 위와 동일하게 헤더 제거
export const updatePost = (postId, formData) => {
  return axios.put(`${COMMUNITY_BASE}update/${postId}`, formData);
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

export const fetchPostImages = (postId) => {
  // 응답 예시: [{filePath:"/files/community/10/xxx.jpg"}, ...]
  return axios.get(`community/files/${postId}`);
};

// 새 이미지 추가 업로드
export const addPostImages = (postId, formData) => {
  // POST /api/OTD/community/files/{postId}
  return axios.post(`community/files/${postId}`, formData);
};

// 단일 이미지 삭제
export const deletePostImage = (fileId) => {
  // DELETE /api/OTD/community/file/{fileId}
  return axios.delete(`community/file/${fileId}`);
};