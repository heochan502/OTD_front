import axios from 'axios';

const COMMENT_BASE = '/community/comment';

// 특정 게시글의 댓글 목록 조회
export const fetchCommentsByPost = (postId) => {
  return axios.get(`${COMMENT_BASE}/list/${postId}`);
};

// 댓글 작성
export const createComment = (postId, content) => {
  return axios.post(`${COMMENT_BASE}/create`, {
    postId,
    content,
  });
};

// 댓글 수정
export const updateComment = (commentId, content) => {
  return axios.put(`${COMMENT_BASE}/update/${commentId}`, { content });
};

// 댓글 삭제
export const deleteComment = (commentId) => {
  return axios.delete(`${COMMENT_BASE}/delete/${commentId}`);
};

// 좋아요 상태 확인 (true/false)
export const checkLikeStatus = (postId) => {
  return axios.get(`/community/like/status/${postId}`);
};

// 좋아요 토글 (등록 또는 취소)
export const toggleLike = (postId) => {
  return axios.post(`/community/like/${postId}`);
};
