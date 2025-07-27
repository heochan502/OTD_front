import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/OTD',
  withCredentials: true, // 세션 쿠키 포함
});

// ❌ 세션 기반이므로 토큰 헤더는 제거 (아래 주석 처리 가능)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// ✅ 인증 에러 시 로그인 페이지로 이동
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("401 인증 오류 → 로그인 페이지로 이동");
      window.location.href = "/account/login"; // 경로는 프로젝트에 맞게 조정
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