<script setup>
import MemoHttpService from '@/service/MemoHttpService';
import { reactive, onMounted } from 'vue';

const memos = [];

const state = reactive({
  otd: [],
});

onMounted( () => {
    findAll({});
})

const findAll = async (params) => {
    const data = await MemoHttpService.findAll(params);
    state.otd = data.resultData;
}

const model = {
    searchText: "",
};
const search = () => {
    const params = { search_text: model.searchText};
    findAll(params);
}
const remove = async id => {
    if(!confirm("삭제하시겠습니까?")) {
        return;
    }
    const data = await MemoHttpService.deleteById(id);
    if(data.resultData === 1) {
        search();
    }
};
</script>

<template>
  <div class="memo-list">
  <router-link to="/otd/memo/add" class="add btn btn-primary pb-3 mb-3 w-10">
  + 메모 추가 </router-link>
  <router-link to="/otd/diary/add" class="add btn btn-primary pb-3 mb-3 w-10">
  + 다이어리 쓰기 </router-link>
    <router-link v-for="m in state.otd" :to="`/otd/${m.id}`"
                 class="item" :key="m.id">
      <div class="d-flex pt-3">
        <div class="pb-3 mb-0 w-10">
          <div class="d-flex justify-content-between">
            <b>{{ m.title }}</b>
            <div>
              <span role="button" @click.prevent="remove(m.id)">삭제</span>
            </div>
          </div>
          <div class="mt-2">{{ m.content }}</div>
        </div>
      </div>
    </router-link>    
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