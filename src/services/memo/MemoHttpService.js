import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

class MemoHttpService {
  async findAll(params) {
    return this._request('get', '/memoAndDiary/memo', { params }, '메모 목록 조회');
  }

  async findById(id) {
    return this._request('get', `/memoAndDiary/memo/${id}`, null, `메모(ID: ${id}) 조회`);
  }

  async create(formData) {
    return this._request('post', '/memoAndDiary/memo', formData, '메모 등록', {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async modify(formData) {
    return this._request('put', '/memoAndDiary/memo', formData, '메모 수정', {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteById(id) {
    return this._request('delete', `/memoAndDiary/memo`, { params: { id } }, `메모(ID: ${id}) 삭제`);
  }

  async _request(method, url, data, context, extraConfig = {}) {
    try {
      let res;
      if (method === 'get' || method === 'delete') {
        res = await axios[method](url, { ...extraConfig, ...(data || {}) });
      } else {
        res = await axios[method](url, data, extraConfig);
      }
      return res?.data?.resultData ?? {};
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
  }
}

export default new MemoHttpService();