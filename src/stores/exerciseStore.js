import { defineStore } from "pinia";
import { getExercise, getElogs } from "@/services/health/elogService";
import { reactive } from "vue";

export const useExerciseStore = defineStore("exercise", {
  state: () =>
    reactive({
      list: [],
      loaded: false,
      logs: [],
    }),
  actions: {
    async fetchExercises() {
      if (this.loaded) return;
      const res = await getExercise();
      this.list = res.data;
      this.loaded = true;
    },
    async fetchExerciselogs() {
      const res = await getElogs();
      this.logs = res.data;
    },
  },
});
