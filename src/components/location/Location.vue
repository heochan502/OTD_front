<script setup>
import { ref, reactive, watch } from 'vue';
import { getLocalName, saveLocation } from '@/services/weather/locationService';

const keyword = ref('');
const selectedLocation = ref(null);
const state = reactive({
  items: [], // 지역 검색 결과 리스트
  autocomplete: [], // 자동완성용 리스트
});

const searchLocation = async () => {
  if (!keyword.value.trim()) {
    alert('지역명을 입력하세요');
    return;
  }
  const res = await getLocalName(keyword.value);
  state.items = res.data;
  console.log('test', res.data);
  state.autocomplete = res.data.map(
    (item) => `${item.city} ${item.county} ${item.town}`
  );
};

const saveLocal = (searchText) => {
  keyword.value = searchText;
  selectedLocation.value = state.items.find(
    (item) => `${item.city} ${item.county} ${item.town}` === searchText
  );
};
const selectLocation = async () => {
  if (!keyword.value) {
    alert('지역 정보가 일치하지 않습니다');
    return;
  }
  try {
    await saveLocation(selectedLocation.value.localId);
    alert('지역이 저장되었습니다');
  } catch (e) {
    console.log(e);
    alert('저장에 실패했습니다');
  }
};

watch(keyword, async (val) => {
  if (!val || typeof val !== 'string' || !val.trim()) return {};
  await searchLocation();
});
</script>

<template>
  <div class="container d-flex flex-row">
    <v-combobox
      v-model="keyword"
      :items="state.autocomplete"
      label="구 / 동을 입력하세요"
      variant="solo-filled"
      placeholder="예) OO구 OO동"
      :menu-props="{ maxHeight: '250px' }"
      @update:model-value="saveLocal"
      @keyup.enter="searchLocation"
    ></v-combobox>
  </div>
  <div class="mt-3">
    <p>선택된 지역: {{ keyword }}</p>
    <button class="btn btn-primary" @click="selectLocation">저장</button>
  </div>
</template>
