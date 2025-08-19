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
    let message = `❌ ${contextMessage} 중 오류가 발생했습니다.`;

    if (status === 401) {
      message = '🔒 로그인 후 이용해주세요.';
    } else if (status === 403) {
      message = '⛔ 권한이 없습니다.';
    } else if (status === 500) {
      message = '💥 서버 내부 오류가 발생했습니다.';
    }

    alert(message);
    console.error(`❌ ${contextMessage} 실패:`, err);
  }
}

export default new DiaryHttpService();