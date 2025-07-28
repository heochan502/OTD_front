import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api/OTD/memoAndDiary';  // 기본 경로 통일

class MemoHttpService {
  async findAll(params) {
    const res = await axios.get('/memo', { params });
    return res.data.resultData;
  }

  async findById(id) {
    const res = await axios.get(`/memo/${id}`);
    return res.data;
  }

  async create(formData) {
    const res = await axios.post('/memo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async modify(formData) {
    const res = await axios.put('/memo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async deleteById(id) {
    const res = await axios.delete(`/memo?id=${id}`);
    return res.data.resultData;
  }
}

export default new MemoHttpService();