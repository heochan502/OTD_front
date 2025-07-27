import axios from 'axios';

// 기본 API 주소 설정 (환경 변수 없으면 localhost 사용)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/OTD',
  withCredentials: true, // 세션 쿠키 포함
});

class DiaryService {
  async create(formData) {
    const res = await api.post('/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async findAll(params) {
    const res = await api.get('/diary', {
      params: { page: 1, size: 5, ...params },
    });
    return res.data;
  }

  async findById(id) {
    const res = await api.get(`/diary/${id}`);
    return res.data;
  }

  async modify(jsonBody) {
    const res = await api.put('/diary', jsonBody);
    return res.data;
  }

  async deleteById(id) {
    const res = await api.delete(`/diary?id=${id}`);
    return res.data;
  }
}

export default new DiaryService();