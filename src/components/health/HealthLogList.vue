<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useHealthStore } from "@/stores/healthStore";

const router = useRouter();
const healthStore = useHealthStore();

const state = reactive({
  logs: [],
});

onMounted(async () => {
  await healthStore.fetchHealthlogs();
  state.logs = healthStore.logs;
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// @click
const add = () => {
  router.push("/hlog/add");
};
const detail = (healthlogId) => {
  router.push(`/hlog/${healthlogId}`);
};
</script>

<template>
  <div class="list_title">
    <div>건강기록</div>
    <div>
      <i class="bi bi-plus-circle btn-plus" @click="add"></i>
    </div>
  </div>
  <div class="list-wrap">
    <ul>
      <li v-if="state.logs.length < 1" class="title">건강 기록을 추가하세요</li>
      <li
        v-for="item in state.logs"
        :key="item.healthlogId"
        @click="detail(item.healthlogId)"
      >
        <div class="title">
          {{ formatDate(item.healthlogDatetime) }}
        </div>
        <div class="content">
          <div>건강보기</div>
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
  overflow-x: hidden;
}
ul {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;

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
