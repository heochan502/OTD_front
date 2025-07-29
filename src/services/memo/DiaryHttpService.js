import axios from 'axios';

axios.defaults.baseURL = '/memoAndDiary';
axios.defaults.withCredentials = true;

class DiaryHttpService {
  async findAll(params) {
    try {
      const res = await axios.get('/diary', { params });
      return res.data.resultData;
    } catch (err) {
      console.error('📔 다이어리 목록 조회 실패:', err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const res = await axios.get(`/diary/${id}`);
      return res.data.resultData;
    } catch (err) {
      console.error(`📔 다이어리(ID: ${id}) 조회 실패:`, err);
      throw err;
    }
  }

  async create(formData) {
    try {
      const res = await axios.post('/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.resultData;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        console.error('🔒 401: 로그인 필요');
      } else if (status === 403) {
        console.error('⛔ 403: 권한 없음');
      } else if (status === 500) {
        console.error('💥 500: 서버 오류');
      } else {
        console.error('📔 다이어리 생성 실패:', err);
      }
      throw err;
    }
  }

  async modify(formData) {
    try {
      const res = await axios.put('/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.resultData;
    } catch (err) {
      console.error('📔 다이어리 수정 실패:', err);
      throw err;
    }
  }

  async deleteById(id) {
    try {
      const res = await axios.delete(`/diary?id=${id}`);
      return res.data.resultData;
    } catch (err) {
      console.error(`🗑️ 다이어리(ID: ${id}) 삭제 실패:`, err);
      throw err;
    }
  }
}

export default new DiaryHttpService();