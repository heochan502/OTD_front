import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

class DiaryHttpService {
  async findAll(params) {
    try {
      const res = await axios.get('/memoAndDiary/diary', { params });
      console.log('서버 응답:', res.data.resultData);
      return res.data.resultData;
    } catch (err) {
      console.error('❌ API 요청이 HTML을 반환했습니다. 경로 확인 필요');
      if (err.response?.data) {
        console.error(err.response.data);
      }
      console.error('서버 요청 실패:', err);
      throw err;
    }
  }

  async findById(diaryId) {
    try {
      const res = await axios.get(`/memoAndDiary/diary/${diaryId}`);
      return res.data.resultData;
    } catch (err) {
      this._handleError(err, `다이어리(ID: ${diaryId}) 조회`);
      throw err;
    }
  }

  async create(formData) {
    try {
      const res = await axios.post('/memoAndDiary/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.resultData;
    } catch (err) {
      this._handleError(err, '다이어리 등록');
      throw err;
    }
  }

  async modify(formData) {
    try {
      const res = await axios.put('/memoAndDiary/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.resultData;
    } catch (err) {
      this._handleError(err, '다이어리 수정');
      throw err;
    }
  }

  async deleteById(diaryId) {
    try {
      const res = await axios.delete(`/memoAndDiary/diary/${diaryId}`);
      return res.data.resultData;
    } catch (err) {
      this._handleError(err, `다이어리(ID: ${diaryId}) 삭제`);
      throw err;
    }
  }

  _handleError(err, contextMessage) {
    const status = err.response?.status;
    if (status === 401) {
      console.error(`🔒 401: 인증 필요 - ${contextMessage}`);
    } else if (status === 403) {
      console.error(`⛔ 403: 권한 없음 - ${contextMessage}`);
    } else {
      console.error(`📔 ${contextMessage} 실패:`, err);
    }
  }
}

export default new DiaryHttpService();