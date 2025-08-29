import { defineStore } from 'pinia';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    refresh: false,
  }),
  actions: {
    homeRefresh() {
      this.refresh = !this.refresh;
    },
  },
});
