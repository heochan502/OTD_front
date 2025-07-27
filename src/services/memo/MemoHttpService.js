import api from "@/utils/MemoAndDiaryApi"; // 공통 Axios 인스턴스

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

    const res = await api.post("/memo", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async findAll(params) {
    const res = await api.get("/memo", {
      params: { page: 1, size: 5, ...params },
    });
    return res.data;
  }

  async findById(id) {
    const res = await api.get(`/memo/${id}`);
    return res.data;
  }

  async modify(jsonBody) {
    const res = await api.put("/memo", jsonBody);
    return res.data;
  }

  async deleteById(id) {
    const res = await api.delete(`/memo?id=${id}`);
    return res.data;
  }
}

export default new MemoHttpService();