import axios from "axios";
axios.defaults.baseURL = "/api/OTD";

const path = "/health";

// 운동기록 생성
export const saveElog = (args) => {
  return axios.post(path, args).catch((e) => e.response);
};

// 운동기록 목록
export const getElogs = () => {
  return axios.get(`${path}/elog`).catch((e) => e.response);
};

// 운동 목록
export const getExercise = () => {
  return axios.get(path).catch((e) => e.response);
};
