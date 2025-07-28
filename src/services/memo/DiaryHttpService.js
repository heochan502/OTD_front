import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api/OTD/memoAndDiary';  // 기본 경로 통일

class DiaryHttpService {
  async findAll(params) {
    const res = await axios.get('/diary', { params });
    return res.data.resultData;
  }

  async findById(id) {
    const res = await axios.get(`/diary/${id}`);
    return res.data;
  }

  async create(formData) {
    const res = await axios.post('/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async modify(formData) {
    const res = await axios.put('/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async deleteById(id) {
    const res = await axios.delete(`/diary?id=${id}`);
    return res.data.resultData;
  }
}

export default new DiaryHttpService();