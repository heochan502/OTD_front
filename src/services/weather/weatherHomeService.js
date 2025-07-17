import axios from '@/services/httpRequester';

export const getUltraSrtFcst = (baseDate, baseTime, nx, ny) => {
  return axios
    .get('/weather/ultra_srt_fcst', {
      params: { baseDate, baseTime, nx, ny },
    })
    .catch((e) => e.response);
};
