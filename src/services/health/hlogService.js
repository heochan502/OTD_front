import axios from "axios";
axios.defaults.baseURL = '/api/OTD';

const path = "/health/hlog";

// 건강기록 생성
export const saveHlog = (args) => {
  return axios.post(path, args).catch((e) => e.response);
};

// 건강기록 목록 조회
export const getHlogs = (weekly) => {
  return axios.get(path, { params: weekly }).catch((e) => e.response);
};

// 건강기록 리스트 페이징
export const getHlogList = (params) => {
  return axios.get(`${path}/list`, { params }).catch((e) => e.response);
};

// 건강기록 상세 조회
export const getHlog = (healthlogId) => {
  return axios.get(`${path}/${healthlogId}`).catch((e) => e.response);
};

// 건강기록 삭제
export const deleteHlog = (healthlogId) => {
  return axios
    .delete(`${path}?healthlog_id=${healthlogId}`)
    .catch((e) => e.response);
};

// 건강기록달력 날짜
export const getHealthlogCalendar = (params) => {
  return axios.get(`${path}/calendar`, { params }).catch((e) => e.response);
};
