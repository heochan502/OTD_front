<script setup>
import { onMounted, reactive, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useExerciseStore } from "@/stores/exerciseStore";
import { formatDate } from "@/utils/reportUtils";
import { getElogList } from "@/services/health/elogService";

const router = useRouter();
const exerciseStore = useExerciseStore();

const data = {
  page: 1,
  rowPerPage: 7,
};
const state = reactive({
  isLoading: false,
  isFinish: false,
});

const handleScroll = (e) => {
  const target = e.target; // list-wrap
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;

  const nearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 바닥 근처
  if (nearBottom) {
    getData();
  }
};

onMounted(() => {
  exerciseStore.fetchExercises();
  getData();
});

onUnmounted(() => {
  // exerciseStore.clearLogList();
});

const getData = async () => {
  if (state.isLoading || state.isFinish) return;
  state.isLoading = true;
  const params = {
    page: data.page++,
    row_per_page: data.rowPerPage,
  };
  const res = await getElogList(params);

  if (res.status === 200) {
    const result = res.data;
    if (result && result.length > 0) {
      exerciseStore.addLogList(result);
    }
    if (result.length < data.rowPerPage) {
      state.isFinish = true;
    }
  }
  state.isLoading = false;
};

// click event
const detail = (exerciselogId) => {
  router.push(`/elog/${exerciselogId}`);
};
const add = () => {
  router.push("/elog/form");
};
</script>

<template>
  <div class="wrap">
    <div class="list_title">
      <div>운동기록</div>
      <div>
        <i class="bi bi-plus-circle btn-plus" @click="add"></i>
      </div>
    </div>
    <div class="list-wrap" @scroll="handleScroll">
      <ul>
        <li v-if="exerciseStore.logList.length < 1" class="title w-0 sm:w-100">
          운동 기록을 추가하세요
        </li>
        <li
          v-for="item in exerciseStore.logList"
          :key="item.exerciselogId"
          @click="detail(item.exerciselogId)"
          class="w-100"
        >
          <div class="title text-subtitle-1 w-50">
            {{ exerciseStore.exerciseList[item.exerciseId - 1]?.exerciseName }}
          </div>
          <div class="content text-caption text-sm-body-2">
            <div>{{ item.exerciseDuration }}분</div>
            <div>
              {{ formatDate(item.exerciseDatetime) }}
            </div>
          </div>
        </li>
        <li v-if="state.isLoading" class="title">로딩중...</li>
        <li v-else-if="state.isFinish" class="title">마지막 기록입니다</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  min-width: 310px;
  max-width: 400px;
  width: 400px;
}
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

    min-width: 310px;
    height: 80px;
    margin: 9px 0;
    padding: 5px 35px;
    border-radius: 40px;
    background-color: #3bbeff;
    cursor: pointer;
  }
}
.title {
  // font-size: 18px;
  // font-weight: 600;
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
