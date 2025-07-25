import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
console.log("API_URL (raw env):", import.meta.env.VITE_API_URL);
console.log("API_URL (processed):", axios.defaults.baseURL);

class MemoHttpService {
  async create(userId, formData) {
    const res = await axios.post(`/memo/${userId}`, formData,);
    return res.data;
  }

async findAll(params) {
  const res = await axios.get("/memo", { params });
  return res.data;
}

async findById(id) {
  const res = await axios.get(`/memo/${id}`);
  return res.data;
}

async modify(id, jsonBody) {
  const res = await axios.put(`/memo`, jsonBody);
  return res.data;
}

async deleteById(id) {
  const res = await axios.delete(`/memo?id=${id}`);
  return res.data;
}
}

export default new MemoHttpService();