<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import {
  getLocalName,
  getLocalList,
  selectLocation,
  saveLocation,
  removeLocation,
} from '@/services/weather/locationService';
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/weatherStore';

const emit = defineEmits(['close']);
const weatherStore = useWeatherStore();
const router = useRouter();
const keyword = ref('');
const selectedLocation = ref(null);
const state = reactive({
  items: [], // 지역 검색 결과 리스트
  autocomplete: [], // 자동완성용 리스트
  list: [],
});

// 모달 통일
const confirmDialog = ref(false);
const alertDialog = ref({ visible: false, message: '' });
const confirmMessage = ref('');
const actions = ref(null);
const selectedLocalId = ref(null);
const selectedLocationName = ref('');

const openConfirm = (message, action, localId = null, locationName = '') => {
  confirmDialog.value = true;
  confirmMessage.value = message;
  actions.value = action;
  selectedLocalId.value = localId;
  selectedLocationName.value = locationName;
};
const confirmYes = async () => {
  confirmDialog.value = false;

  if (actions.value === 'select') {
    const res = await selectLocation(selectedLocalId.value);
    if (res && res.status === 200) {
      weatherStore.triggerRefresh();
      emit('close');
      router.push('/');
    }
  } else if (actions.value === 'remove') {
    const res = await removeLocation(selectedLocalId.value);
    if (res.status === 200) {
      openAlert('삭제되었습니다.');
      await LocalList();
    }
  }
};

const openAlert = (message) => {
  alertDialog.value.message = message;
  alertDialog.value.visible = true;
};

const searchLocation = async () => {
  if (!keyword.value.trim()) {
    openAlert('지역명을 입력하세요');
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

const saveSearchedLocation = async () => {
  if (!selectedLocation.value || !selectedLocation.value.localId) {
    openAlert('지역 정보가 일치하지 않습니다.');
    return;
  }
  await saveLocation(selectedLocation.value.localId);
  openAlert('지역이 저장되었습니다.');
  await LocalList();
};

const LocalList = async () => {
  const res = await getLocalList();
  state.list = res.data;
};

watch(keyword, async (val) => {
  if (!val || typeof val !== 'string' || !val.trim()) return {};
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
      <!-- alert -->
      <v-dialog v-model="alertDialog.visible" max-width="300" max-height="150">
        <v-card>
          <v-card-text>{{ alertDialog.message }}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn class="primary" text @click="alertDialog.visible = false"
              >확인</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
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
              openConfirm(
                `${item.city} ${item.county} ${item.town}이(가) 선택되었습니다. 홈 화면에 표시하겠습니까?`,
                'select',
                item.localId,
                `${item.city} ${item.county} ${item.town}`
              )
            "
          >
            홈화면에 표시
          </button>
          <button
            class="btn btn-outline-danger btn-sm"
            @click="
              openConfirm(
                '선택한 지역을 삭제하시겠습니까?',
                'remove',
                item.localId
              )
            "
          >
            삭제
          </button>
          <!-- confirm -->
          <v-dialog v-model="confirmDialog" max-width="400">
            <v-card>
              <v-card-title>확인</v-card-title>
              <v-card-text>{{ confirmMessage }}</v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="success" text @click="confirmYes">예</v-btn>
                <v-btn color="dark" text @click="confirmDialog = false"
                  >아니오</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
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
