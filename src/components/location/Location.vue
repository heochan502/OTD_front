<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import {
  getLocalName,
  getLocalList,
  selectLocation,
  saveLocation,
  removeLocation,
} from "@/services/weather/locationService";
import { useRouter } from "vue-router";

const router = useRouter();
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

const selectWeatherLocation = async (localId, locationName) => {
  const res = await selectLocation(localId);
  if (res && res.status === 200) {
    if (
      confirm(
        `${locationName}이(가) 선택 되었습니다. \n홈 화면으로 이동하시겠습니까?`
      )
    ) {
      router.push("/");
    }
  }
};

const saveSearchedLocation = async () => {
  if (!selectedLocation.value || !selectedLocation.value.localId) {
    alert("지역 정보가 일치하지 않습니다");
    console.log(selectedLocation.value);
    return;
  }
  await saveLocation(selectedLocation.value.localId);
  alert("지역이 저장되었습니다");
  await LocalList();
};

const removeLocal = async (localId) => {
  if (confirm("선택한 지역을 삭제하시겠습니까?")) {
    const res = await removeLocation(localId);
    if (res.status === 200) {
      alert("삭제되었습니다.");
      await LocalList();
    }
  }
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
  <div class="search-box card shadow-sm p-4 mb-4">
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
    <div class="text-end mt-3">
      <button class="btn btn-primary" @click="saveSearchedLocation">
        + 검색한 지역 저장 +
      </button>
    </div>
  </div>

  <div class="list card p-4 shadow-sm">
    <h2>저장한 지역 목록</h2>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item d-flex align-items-center justify-content-between"
        v-for="(item, index) in state.list"
        :key="index"
      >
        <span class="location-name">
          {{ item.city }} {{ item.county }} {{ item.town }}
        </span>
        <div class="d-flex gap-2">
          <button
            class="btn btn-outline-primary btn-sm"
            @click="
              selectWeatherLocation(
                item.localId,
                `${item.city} ${item.county} ${item.town}`
              )
            "
          >
            홈화면에 표시
          </button>
          <button
            class="btn btn-outline-danger btn-sm"
            @click="removeLocal(item.localId)"
          >
            삭제
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.list {
  color: black;
}
.location-name {
  font-size: 25px;
}
.location-wrapper {
  max-width: 700px;
  margin: auto;
}

.search-box {
  background-color: #f8f9fa;
  border-radius: 1rem;
}

.list-group-item {
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #f1f1f1;
  }
}
</style>
