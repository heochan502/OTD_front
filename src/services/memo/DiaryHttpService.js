import axios from 'axios';
axios.defaults.withCredentials = true;

class DiaryHttpService {
  async findAll(params) {
    const res = await axios.get('/diary', {
      params: {
        currentPage: 1,
        pageSize: 10,
      }
    });
    return res.data.resultData;
  }

  async findById(id) {
    const res = await axios.get(`/diary/${id}`);
    return res.data.resultData;
  }

  async create(formData) {
    const res = await axios.post('/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async modify(diaryData) {
    const res = await axios.put('/diary', diaryData);
    return res.data.resultData;
  }

  async deleteById(id) {
    const res = await axios.delete(`/diary?id=${id}`);
    return res.data.resultData;
  }
}

export default new DiaryHttpService();