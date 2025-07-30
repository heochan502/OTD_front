import axios from 'axios';

axios.defaults.withCredentials = true;

class MemoHttpService {
  // 메모 목록 조회
  async findAll(params) {
    try {
      const res = await axios.get('/memoAndDiary/memo', { params });
      return res.data.resultData;
    } catch (err) {
      console.error('메모 목록 조회 실패:', err);
      throw err;
    }
  }

  // 단일 메모 조회
  async findById(id) {
    try {
      const res = await axios.get(`/memoAndDiary/memo/${id}`);
      return res.data.resultData;
    } catch (err) {
      console.error('메모 조회 실패:', err);
      throw err;
    }
  }

  // 메모 생성
  async create(formData) {
  try {
    const res = await axios.post('/memoAndDiary/memo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  } catch (err) {
    const status = err.response?.status;
    if (status === 401) {
      console.error('401: 로그인 필요');
    } else if (status === 403) {
      console.error('403: 권한 없음');
    } else if (status === 500) {
      console.error('500: 서버 오류');
    }
    throw err; // 반드시 다시 throw 해야 호출부에서 처리 가능
  }
}

  // 메모 수정
  async modify(formData) {
    try {
      const res = await axios.put('/memoAndDiary/memo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.resultData;
    } catch (err) {
      console.error('메모 수정 실패:', err);
      throw err;
    }
  }

  // 메모 삭제
  async deleteById(id) {
    try {
      const res = await axios.delete(`/memoAndDiary/memo?id=${id}`);
      return res.data.resultData;
    } catch (err) {
      console.error('메모 삭제 실패:', err);
      throw err;
    }
  }
}

export default new MemoHttpService();