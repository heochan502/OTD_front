import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
console.log("API_URL (from env, now OTD):", import.meta.env.VITE_API_URL);


class MemoHttpService {
  async create(formData) {
  const res = await axios.post("/memo", formData, {
    withCredentials: true,
  });
  return res.data;
  }

async findAll(params) {
  const res = await axios.get("/memo", {
    params: { page: 1, size: 5, ...params },
  withCredentials: true,
  });
  return res.data;
  }

async findById(id) {
  try {
    const res = await axios.get(`/memo/${id}`, {
    withCredentials: true });
    return res.data;
  } catch (error) {
    console.error("Memo 조회 실패:", error);
    throw error;
  }
}

async modify(jsonBody) {
  const res = await axios.put(`/memo`, jsonBody, {
    withCredentials: true,
  });
  return res.data;
  }

async deleteById(id) {
  const res = await axios.delete(`/memo?id=${id}`, {
    withCredentials: true,
  });
  return res.data;
  }
}

export default new MemoHttpService();