<script setup>
import { ref, reactive } from 'vue';
import { getLocalName } from '@/services/weather/locationService';

const keyword = ref('');
const showList = ref(false);
const state = reactive({
  items: [],
});

const searchLocation = async () => {
  if (!keyword.value.trim()) {
    alert('지역명을 입력하세요');
    return;
  }
  const res = await getLocalName(keyword.value);
  state.items = res.data;
  showList.value = true;
};
</script>

<template>
  <div class="container">
    <div class="mb-3 mt-3 d-flex">
      <input
        v-model="keyword"
        type="search"
        placeholder="시 / 구 / 동을 입력하세요"
        class="form-control mb-3"
        @keyup.enter="searchLocation"
      />
      <button @click="searchLocation" class="btn btn-primary mb-3">검색</button>
    </div>
    <div class="row d-flex" v-if="showList">
      <button class="col" v-for="item in state.items" :key="item.id">
        {{ item.city }} {{ item.county }} {{ item.town }}
      </button>
    </div>
  </div>
</template>
