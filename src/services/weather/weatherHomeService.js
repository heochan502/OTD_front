import axios from "@/services/weather/weatherRequester";

export const getWeather = (memberId) => {
  return axios.get(`/weather/${memberId}`).catch((e) => e.response);
};
