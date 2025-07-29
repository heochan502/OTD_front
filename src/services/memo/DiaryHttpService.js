import axios from 'axios';

axios.defaults.withCredentials = true;

class DiaryHttpService {
  async findAll(params) {
  const res = await axios.get('/memoAndDiary/diary', { params });
  console.log('API 응답 데이터:', res.data);
  
  // 만약 res.data가 배열이라면 아래처럼 바꿔야 함
  if (Array.isArray(res.data)) {
    return res.data;
  }
  // 보통 resultData에 배열이 있다면 이게 맞음
    return res.data.resultData;
  }

  async findById(id) {
    const res = await axios.get(`/memoAndDiary/diary/${id}`);
    return res.data.resultData;
  }

  async create(formData) {
    const res = await axios.post('/memoAndDiary/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async modify(diaryData) {
    const res = await axios.put('/memoAndDiary/diary', diaryData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.resultData;
  }

  async modifyWithImage(formData) {
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