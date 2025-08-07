import axios from 'axios';

// 백엔드 서버의 실제 도메인 주소 명시
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/OTD',
  withCredentials: true, // ✅ 세션 쿠키 포함
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('401 인증 오류 → 로그인 페이지로 이동');
      window.location.href = '/account/login'; // 프로젝트 경로에 맞게 조정
    }
    return Promise.reject(error);
  }
);

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}`;
}

export default api;