import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api/OTD';  // 기본 API 경로

class DiaryHttpService {
  async findAll(params) {
    const res = await axios.get('/memoAndDiary/diary', { params });
    return res.data.resultData;
  }

  async findById(id) {
    const res = await axios.get(`/memoAndDiary/diary/${id}`);
    return res.data;
  }

  async create(formData) {
    const res = await axios.post('/memoAndDiary/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async modify(formData) {
    const res = await axios.put('/memoAndDiary/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async deleteById(id) {
    const res = await axios.delete(`/memoAndDiary/diary?id=${id}`);
    return res.data.resultData;
  }
}

export default new DiaryHttpService();