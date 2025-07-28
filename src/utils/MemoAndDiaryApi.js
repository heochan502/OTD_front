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

export function formatDateTime(dateStr, weekday = false) {
  const options = weekday
    ? { weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" }
    : { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };

  return new Date(dateStr).toLocaleString("ko-KR", options);
}

export default api;