import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
console.log("API_URL (from env, now OTD):", import.meta.env.VITE_API_URL);


class MemoHttpService {
  async create(formData) {
  const res = await axios.post("/memo", formData, {
    withCredentials: true,
  });
  return res.data;
  }

async findAll(params) {
  const res = await axios.get("/memo", {
    params: { page: 1, size: 5, ...params },
  withCredentials: true,
  });
  return res.data;
  }

async findById(id) {
  try {
    const res = await axios.get(`/memo/${id}`, {
    withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Memo 조회 실패:", error);
    throw error;
  }
}

async modify(jsonBody) {
  const res = await axios.put(`/memo`, jsonBody, {
    withCredentials: true,
  });
  return res.data;
  }

async deleteById(id) {
  const res = await axios.delete(`/memo?id=${id}`, {
    withCredentials: true,
  });
  return res.data;
  }
}
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("인증 오류 발생, 로그인 페이지로 리다이렉트");
      window.location.href = "/login"; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);
export default new MemoHttpService();