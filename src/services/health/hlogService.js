import axios from "axios";
axios.defaults.baseURL = "/api/OTD";

const path = "/health/hlog";

// 건강기록 생성
export const saveHlog = (args) => {
  return axios.post(path, args).catch((e) => e.response);
};

// 건강기록 목록 조회
export const getHlogs = () => {
  return axios.get(path).catch((e) => e.response);
};

// 건강기록 상세 조회
export const getHlog = (healthlogId) => {
  return axios.get(`${path}/${healthlogId}`).catch((e) => e.response);
};

// 건강기록 삭제
export const deleteHlog = (exerciselogId) => {
  return axios
    .delete(`${path}?exerciselog_id=${exerciselogId}`)
    .catch((e) => e.response);
};
