import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api/OTD';  // 기본 경로 통일

class DiaryHttpService {
  async findAll(params) {
    const res = await axios.get('/memo-and-diary/diary', { params });
    return res.data.resultData;
  }

  async findById(id) {
    const res = await axios.get(`/memo-and-diary/diary/${id}`);
    return res.data;
  }

  async create(formData) {
    const res = await axios.post('/memo-and-diary/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async modify(formData) {
    const res = await axios.put('/memo-and-diary/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async deleteById(id) {
    const res = await axios.delete(`/memo-and-diary/diary?id=${id}`);
    return res.data.resultData;
  }
}

export default new DiaryHttpService();