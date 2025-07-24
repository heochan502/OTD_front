import { defineStore } from "pinia";
import { getExercise } from "@/services/health/elogService";

export const useExerciseStore = defineStore("exercise", {
  state: () => ({
    list: [],
    loaded: false,
  }),
  actions: {
    async fetchExercises() {
      if (this.loaded) return;
      const res = await getExercise();
      this.list = res.data;
      this.loaded = true;
    },
  },
});
