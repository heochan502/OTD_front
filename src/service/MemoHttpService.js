import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

class MemoHttpService {
    async create(jsonBody) {
        const res = await axios.post("/otd", jsonBody);
        return res.data;
    }
    async findAll(params) {
        const res = await axios.get("/otd", { params });
        return res.data;
    }
    async findById(id) {
        const res = await axios.get(`/otd/${id}`);
        return res.data;
    }
    async modify(jsonBody) {
        const res = await axios.put("/otd", jsonBody);
        return res.data;
    }
    async deleteById(id) {
        const res = await axios.delete(`/otd?id=${id}`);
        return res.data;
    }
}

export default new MemoHttpService();