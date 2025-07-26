import axios from "axios";
axios.defaults.baseURL = "api/OTD/";

const path = "/health";

// 운동기록 생성
export const saveElog = (args) => {
  return axios.post(path, args).catch((e) => e.response);
};

// 운동기록 목록
export const getElogs = () => {
  return axios.get(`${path}/elog`).catch((e) => e.response);
};

// 운동기록상세 목록
export const getElog = (exerciselogId) => {
  return axios.get(`${path}/elog/${exerciselogId}`).catch((e) => e.response);
};

// 운동 목록
export const getExercise = () => {
  return axios.get(path).catch((e) => e.response);
};

// 운동기록수정
export const updateElog = (args) => {
  return axios.put(path, args).catch((e) => e.response);
};

// 운동기록 삭제
export const deleteElog = (exerciselogId) => {
  return axios
    .delete(`${path}?exerciselog_id=${exerciselogId}`)
    .catch((e) => e.response);
};
