<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useExerciseStore } from "@/stores/exerciseStore";
import { formatDate } from "@/utils/reportUtils";

const router = useRouter();
const exerciseStore = useExerciseStore();

const params = {
  page: 1,
  row_per_page: 7,
};

onMounted(async () => {
  await exerciseStore.fetchExercises();
});

// click event
const detail = (exerciselogId) => {
  router.push(`/elog/${exerciselogId}`);
};
const add = () => {
  router.push("/elog/form");
};
</script>

<template>
  <div class="list_title">
    <div>운동기록</div>
    <div>
      <i class="bi bi-plus-circle btn-plus" @click="add"></i>
    </div>
  </div>
  <div class="list-wrap">
    <ul>
      <li v-if="exerciseStore.logs.length < 1" class="title">
        운동 기록을 추가하세요
      </li>
      <li
        v-for="item in exerciseStore.logs"
        :key="item.exerciselogId"
        @click="detail(item.exerciselogId)"
      >
        <div class="title">
          {{ exerciseStore.list[item.exerciseId - 1]?.exerciseName }}
        </div>
        <div class="content">
          <div>{{ item.exerciseDuration }}분</div>
          <div>
            {{ formatDate(item.exerciseDatetime) }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.list_title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 0 5px;

  div {
    font-size: 20px;
    font-weight: 600;
  }

  .btn-plus {
    cursor: pointer;
  }
}
.list-wrap {
  height: 300px;
  overflow: auto;
}
ul {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: auto;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 400px;
    height: 80px;
    margin: 9px 0;
    padding: 5px 40px;
    border-radius: 40px;
    background-color: #3bbeff;
    cursor: pointer;
  }
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;

  color: #fff;
}
</style>
