<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import {
  getLocalName,
  saveLocation,
  getLocalList,
  selectLocation,
} from "@/services/weather/locationService";

const keyword = ref("");
const selectedLocation = ref(null);
const state = reactive({
  items: [], // 지역 검색 결과 리스트
  autocomplete: [], // 자동완성용 리스트
  list: [],
});

const searchLocation = async () => {
  if (!keyword.value.trim()) {
    alert("지역명을 입력하세요");
    return;
  }
  const res = await getLocalName(keyword.value);
  state.items = res.data;
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

const selectWeatherLocation = async (localId) => {
  const res = await selectLocation(localId);
  if (res && res.status === 200) {
    alert("해당 지역이 홈화면에 표시됩니다.");
  }
};

const saveSelectLocation = async () => {
  if (!selectedLocation.value || !selectedLocation.value.localId) {
    alert("지역 정보가 일치하지 않습니다");
    return;
  }
  await saveLocation(selectedLocation.value.localId);
  alert("지역이 저장되었습니다");
  await LocalList();
};

const LocalList = async () => {
  const res = await getLocalList();
  state.list = res.data;
  console.log("locallist", state.list);
};

watch(keyword, async (val) => {
  if (!val || typeof val !== "string" || !val.trim()) return {};
  await searchLocation();
});

onMounted(() => {
  LocalList();
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

  <div class="mt-2">
    <button class="btn btn-primary" @click="saveSearchedLocation">
      검색한 지역 저장
    </button>
  </div>

  <div class="list mt-4">
    <h2>저장한 지역 목록</h2>
    <ul>
      <li v-for="(item, index) in state.list" :key="index">
        {{ item.city }} {{ item.county }} {{ item.town }}
        <button
          class="btn btn-outline-primary btn-sm"
          @click="selectWeatherLocation(item.localId)"
        >
          홈화면에 표시
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.list {
  color: black;
}
</style>
