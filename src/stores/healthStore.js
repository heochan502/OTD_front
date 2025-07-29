import { defineStore } from "pinia";
import { reactive } from "vue";
import { getHlogs } from "@/services/health/hlogService";

export const useHealthStore = defineStore("health", {
  state: () =>
    reactive({
      logs: [],
    }),
  actions: {
    async fetchHealthlogs() {
      const res = await getHlogs();
      this.logs = res.data;
    },
  },
});
