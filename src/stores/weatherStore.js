import { defineStore } from 'pinia';

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    refresh: false,
  }),
  actions: {
    triggerRefresh() {
      this.refresh = !this.refresh;
    },
  },
});
