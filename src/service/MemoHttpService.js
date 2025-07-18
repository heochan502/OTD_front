import axios from 'axios';
axios.defaults.baseURL = 'api/otd/memo';

class MemoHttpService {
    async create(userId, formData) {
        const res = await axios.post(`/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    }
    async findAll(params) {
        const res = await axios.get("/", { params });
        return res.data;
    }
    async findById(id) {
        const res = await axios.get(`/${id}`);
        return res.data;
    }
    async modify(id, jsonBody) {
        const res = await axios.put("/", jsonBody);
        return res.data;
    }
    async deleteById(id) {
        const res = await axios.delete(`/?id=${id}`);
        return res.data;
    }
}

export default new MemoHttpService();