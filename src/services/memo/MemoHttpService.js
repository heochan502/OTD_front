import api from '@/utils/MemoAndDiaryApi';

class MemoHttpService {
  async create(memoData, imageFiles = []) {
    const formData = new FormData();

    const memoBlob = new Blob([JSON.stringify(memoData)], {
      type: 'application/json',
    });
    formData.append('memoData', memoBlob);

    imageFiles.forEach((file) => {
      formData.append('memoImageFiles', file);
    });

    const res = await api.post('/memo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.resultData;
  }

  async findAll(params) {
    const res = await axios.get('/memo', { 
      params: {
        currentPage: 1,
        pageSize: 10,
      }
  });
    return res.data.resultData;
  }


  async findById(id) {
    const res = await api.get(`/memo/${id}`);
    return res.data.resultData;
  }

  async modify(jsonBody) {
    const res = await api.put('/memo', jsonBody);
    return res.data.resultData;
  }

  async deleteById(id) {
    const res = await api.delete(`/memo?id=${id}`);
    return res.data.resultData;
  }
}

export default new MemoHttpService();