import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
console.log("API_URL:", import.meta.env.VITE_API_URL);

class MemoHttpService {
  async create(userId, formData) {
    const res = await axios.post(`/api/otd/memo/${userId}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
    return res.data;
  }

async findAll(params) {
  const res = await axios.get("/api/otd/memo", { params });
  return res.data;
}

async findById(id) {
  const res = await axios.get(`/api/otd/memo/${id}`);
  return res.data;
}

async modify(id, jsonBody) {
  const res = await axios.put(`/api/otd/memo`, jsonBody);
  return res.data;
}

async deleteById(id) {
  const res = await axios.delete(`/api/otd/memo?id=${id}`);
  return res.data;
}

}

export default new MemoHttpService();