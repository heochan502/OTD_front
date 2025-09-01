import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

class DiaryHttpService {
  async findAll(params) {
    const result = await this._request('get', '/memoAndDiary/diary', { params }, '다이어리 목록 조회');
    console.log('📘 [Diary] 서버 응답:', result);
    return result;
  }

  async findById(diaryId) {
    return this._request('get', `/memoAndDiary/diary/${diaryId}`, null, `다이어리(ID: ${diaryId}) 조회`);
  }

  async create(formData) {
    return this._request('post', '/memoAndDiary/diary', formData, '다이어리 등록', {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async modify(formData) {
    return this._request('put', '/memoAndDiary/diary', formData, '다이어리 수정', {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteById(diaryId) {
    return this._request('delete', `/memoAndDiary/diary/${diaryId}`, null, `다이어리(ID: ${diaryId}) 삭제`);
  }

  async _request(method, url, data, context, extraConfig = {}) {
    try {
      let res;
      if (method === 'get' || method === 'delete') {
        res = await axios[method](url, { ...extraConfig, ...(data || {}) });
      } else {
        res = await axios[method](url, data, extraConfig);
      }

      const result = res?.data?.resultData ?? {};

      // HTML 반환 체크 (예외 처리)
      if (typeof result === 'string' && result.startsWith('<!DOCTYPE html')) {
        console.error('❌ API 요청이 HTML을 반환했습니다. 경로 확인 필요');
      }

      return result;
    } catch (err) {
      this._handleError(err, context);
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

    // HTML 응답 디버깅 출력
    if (err.response?.data && typeof err.response.data === 'string' && err.response.data.startsWith('<!DOCTYPE html')) {
      console.error('❗ HTML 응답 내용:', err.response.data);
    }
  }
}

export default new DiaryHttpService();