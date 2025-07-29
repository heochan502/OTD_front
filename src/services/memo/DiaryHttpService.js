import axios from 'axios';

axios.defaults.withCredentials = true;

class DiaryHttpService {
  // 전체 다이어리 목록 조회 (페이지네이션 포함)
  async findAll(params) {
    const res = await axios.get('/api/OTD/memoAndDiary/diary', { params });
    return res.data.resultData;
  }

  // ID로 단일 다이어리 조회
  async findById(id) {
    const res = await axios.get(`/api/OTD/memoAndDiary/diary/${id}`);
    return res.data.resultData;
  }

  // 다이어리 생성 (multipart/form-data)
  async create(formData) {
    const res = await axios.post('/api/OTD/memoAndDiary/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  // 다이어리 수정 (multipart/form-data)
  async modify(formData) {
    const res = await axios.put('/api/OTD/memoAndDiary/diary', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  // 다이어리 삭제
  async deleteById(id) {
    const res = await axios.delete(`/api/OTD/memoAndDiary/diary?id=${id}`);
    return res.data.resultData;
  }
}

export default new DiaryHttpService();