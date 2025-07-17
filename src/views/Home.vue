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
  <router-link to="/otd/memo/add" class="add btn btn-primary pb-3 mb-3 w-100">
  + 메모 추가 </router-link>
  <router-link to="/otd/diary/add" class="add btn btn-primary pb-3 mb-3 w-100">
  + 다이어리 쓰기 </router-link>
    <div class="mb-3 mt-3 d-flex">
        <input type="text" id="title" class="form-control p-3 me-3"
               placeholder = "검색 키워드" v-model="model.searchText"
               @keyup.enter="search" />
        <button class="btn bg-black btn-primary" style="border: none;" @click="search">검색</button>
    </div>
    <router-link v-for="m in state.otd" :to="`/otd/${m.id}`"
                 class="item" :key="m.id">
      <div class="d-flex pt-3">
        <div class="pb-3 mb-0 w-100">
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
    border: 1px solid #eee;
    display: block;
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
  background-color: skyblue;
  color: #313131;
  font-weight: 700;
  display: block;
  padding: 25px;
  border: 1px solid #eee;
  margin-bottom: 1rem;
}
</style>