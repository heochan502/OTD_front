import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
console.log("API_URL (Memo):", import.meta.env.VITE_API_URL);

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
    if (error.response?.status === 401) {
      console.error("인증 오류 발생, 로그인 페이지로 리다이렉트");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

class MemoHttpService {
  /**
   * 메모 등록 - memoData(JSON), imageFiles(List<File>) 입력받아 FormData 구성
   */
  async create(memoData, imageFiles = []) {
    const formData = new FormData();

    // memoData는 JSON 문자열로 Blob 처리해서 전송
    const memoBlob = new Blob([JSON.stringify(memoData)], {
      type: 'application/json',
    });
    formData.append('memoData', memoBlob);

    // 이미지들 추가 (필수 아님)
    imageFiles.forEach((file) => {
      formData.append('memoImageFiles', file);
    });

    const res = await axios.post("/memo", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async findAll(params) {
    const res = await axios.get("/memo", {
      params: { page: 1, size: 5, ...params },
    });
    return res.data;
  }

  async findById(id) {
    try {
      const res = await axios.get(`/memo/${id}`);
      return res.data;
    } catch (error) {
      console.error("Memo 조회 실패:", error);
      throw error;
    }
  }

  async modify(jsonBody) {
    const res = await axios.put("/memo", jsonBody);
    return res.data;
  }

  async deleteById(id) {
    const res = await axios.delete(`/memo?id=${id}`);
    return res.data;
  }
}

export default new MemoHttpService();