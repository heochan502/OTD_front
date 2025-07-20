import axios from "@/services/weather/weatherRequester";

export const getLocalName = () => {
  return axios.get("/weather").catch((e) => e.response);
};

export const getWeather = (memberId) => {
  return axios.get(`weather/${memberId}`).catch((e) => e.response);
};
