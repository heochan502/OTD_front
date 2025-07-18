<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { getLocalName } from '@/services/weather/weatherHomeService';

const state = reactive({
  items: [],
});

const searchText = ref('');
const showList = ref(false);
// 검색어에 맞는 항목만 필터링
const filterItems = computed(() => {
  if (!searchText.value) {
    return alert('지역명을 입력하세요');
  }
  return state.items.filter((item) =>
    (item.city + item.county + item.town).includes(searchText.value)
  );
});

onMounted(async () => {
  const res = await getLocalName();
  console.log(res.data);
  state.items = res.data;
});
</script>

<template>
  <div class="container">
    <div class="mb-3 mt-3 d-flex">
      <input
        v-model="searchText"
        type="text"
        placeholder="시 / 구 / 동을 입력하세요"
        class="form-control mb-3"
        keyup.enter="showList"
      />
      <button @click="showList = true" class="btn btn-primary mb-3">
        검색
      </button>
    </div>
  </div>
  <div class="row d-flex" v-if="showList">
    <button class="col" v-for="item in filterItems" :key="item.id">
      {{ item.city }} {{ item.county }} {{ item.town }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.row {
  flex-direction: column;
  button {
    color: black;
  }
}
</style>
