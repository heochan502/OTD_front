<script setup>
import MemoHttpService from '@/services/MemoHttpService.js';
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';


const memos = [];

const state = reactive({
  otd: [],
});

onMounted( () => {
    findAll({});
});

const findAll = async (params) => {
  const data = await MemoHttpService.findAll(params);
  console.log('findAll data:', data);
  if (data === null || data.status !== 200) {
    console.error('메모 조회 실패:', data);
    return;
  }
  console.log('메모 조회 성공:', data);
  if (data?.resultData) {
    state.otd = data.resultData;
  } else {
    state.otd = [];
  }
};

const model = reactive ({
    searchText: "",
});

const search = () => {
    const params = { search_text: model.searchText};
    findAll(params);
}
const remove = async id => {
    if(!confirm("삭제하시겠습니까?")) {
        return;
    const data = await MemoHttpService.deleteById(id);
    console.log('삭제 결과:', data);
    if (data === null || data.status !== 200) {
        console.error('메모 삭제 실패:', data);
        return;
    }
    if(data.resultData === 1) {
        findAll({});
    }
};
    console.log('메모 삭제 성공:', data);
    alert('메모가 삭제되었습니다.');
    findAll({});
};

const router = useRouter();

</script>

<template>
  <div class="memo-list">
  <router-link to="/memo" class="add btn btn-primary pb-3 mb-3 w-10">
  + 메모 추가 </router-link>
  <router-link to="/diary" class="add btn btn-primary pb-3 mb-3 w-10">
  + 다이어리 쓰기 </router-link>

<div class="item" v-for="m in state.otd" :key="m.id">
  <router-link :to="`/otd/${m.id}`" class="w-100">
    <div class="d-flex pt-3">
      <div class="pb-3 mb-0 w-10">
        <div class="d-flex justify-content-between">
          <b>{{ m.title }}</b>
        </div>
        <div class="mt-2">{{ m.content }}</div>
      </div>
    </div>
  </router-link>
  <div>
    <span role="button" @click.prevent="remove(m.id)">삭제</span>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.memo-list {

}
  ::v-deep(.item) {
    background-color: #f8f9fa;
    border: 5px solid #eee;
    display: flex;
    color: #000;
    text-decoration: none;
    padding: 20px 30px;
    margin: 15px 0;
    transition: border-color 0.2s;
    cursor: pointer;
  }

  ::v-deep(.item:hover) {
    border-color: #aaa;
  }

.add {
  background-color: #4fc3f7;
  color: #313131;
  font-weight: 700;
  display: inline-block;
  width: 180px;
  height: 60px;
  padding: 25px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-right: 20px;
  margin-left: 10px;
  line-height: 10px;

  &:hover {
  background-color: #29b6f6;
  cursor: pointer;
  }
}
</style>