<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const logs = reactive([
  {
    healthlog_id: 1,
    date: "2025-07-08",
  },
  {
    healthlog_id: 2,
    date: "2025-07-16",
  },
]);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const add = () => {
  router.push("/hlog/add");
};
</script>

<template>
  <div class="list_title">
    <div>건강기록</div>
    <div>
      <i class="bi bi-plus-circle btn-plus" @click="add"></i>
    </div>
  </div>
  <ul>
    <li
      v-for="item in logs"
      :key="item.healthlog_id"
      @click="detail(item.healthlog_id)"
    >
      <div class="title">
        {{ formatDate(item.date) }}
      </div>
      <div class="content">
        <div>건강보기</div>
      </div>
    </li>
  </ul>
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
    margin: 15px 0;
    padding: 5px 40px;
    border-radius: 40px;
    background-color: #3bbeff;
    cursor: pointer;

    .title {
      font-size: 20px;
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
  }
}
</style>
