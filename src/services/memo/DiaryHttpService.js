import api from "@/utils/MemoAndDiaryApi"; // 공통 Axios 인스턴스

class DiaryHttpService {
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

export default new DiaryHttpService();