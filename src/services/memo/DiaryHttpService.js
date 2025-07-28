import api from '@/utils/MemoAndDiaryApi';

class DiaryHttpService {
  async create(formData) {
    const res = await api.post('/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async findAll(params = {}) {
    const res = await api.get('/diary', {
      params: {
        page: 1,
        size: 5,
        ...params, // currentPage, pageSize 같은 외부 전달값 반영
      },
    });
    return res.data.resultData;
  }

  async findById(id) {
    const res = await api.get(`/diary/${id}`);
    return res.data.resultData;
  }

  async modify(jsonBody) {
    const res = await api.put('/diary', jsonBody);
    return res.data.resultData;
  }

  async deleteById(id) {
    const res = await api.delete(`/diary/${id}`);
    return res.data.resultData;
  }
}

export default new DiaryHttpService();