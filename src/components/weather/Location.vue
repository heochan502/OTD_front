<script setup>
import { ref, reactive, onMounted } from 'vue';
import {
  getList,
  removeListItem,
  selectLocation,
  modifyTitle
} from '@/services/weather/locationService';
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/weatherStore';
import SearchAPI from './SearchAPI.vue';

const emit = defineEmits(['close']);
const weatherStore = useWeatherStore();
const router = useRouter();
const state = reactive({
  list: [],
});

// 모달 통일
const confirmDialog = ref(false);
const edit = ref(false);
const alertDialog = ref({ visible: false, message: '' });
const confirmMessage = ref('');
const actions = ref(null);
const selectedLocalId = ref(null);
const selectedLocationName = ref('');

const editing = ref(null);

const openEdit = (item) => {
  editing.value = {...item};
  edit.value = true;
}
const openConfirm = (message, action, id = null, title = '') => {
  confirmDialog.value = true;
  confirmMessage.value = message;
  actions.value = action;
  selectedLocalId.value = id;
  selectedLocationName.value = title;
};
const openAlert = (message) => {
  alertDialog.value.message = message;
  alertDialog.value.visible = true;
};

const confirmYes = async () => {
  confirmDialog.value = false;

  if (actions.value === 'select') {
    const res = await selectLocation(selectedLocalId.value);
    if (res && res.status === 200) {
      weatherStore.homeRefresh();
      emit('close');
      router.push('/');
    }
  } else if (actions.value === 'remove') {
    const res = await removeListItem(selectedLocalId.value);
    if (res.status === 200) {
      openAlert('삭제되었습니다.');
      await LocalList();
    }
  }
};
const confirmEdit = async () => {
  const json = {
    id: editing.value.id,
    keyword:editing.value.title
  }
  const res = await modifyTitle(json)
  if (res.status === 200) {
    openAlert('수정되었습니다.');
    await LocalList();
    edit.value = false;
  }
}

const LocalList = async () => {
  const res = await getList();
  state.list = res.data;
};

onMounted(() => {
  LocalList();
});
</script>

<template>
  <SearchAPI @saved="LocalList" class="mb-0" />
  <div class="list card p-4 shadow-sm">
    <h3>저장한 지역 목록</h3>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item d-flex align-items-center justify-content-between"
        v-for="(item, index) in state.list"
        :key="index"
      >
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="location-name">
              <strong>{{ item.title }}</strong> <br />{{ item.roadAddress }} ({{
                item.parcelAddress
              }})
            </span>
          </template>
          <span>{{ item.roadAddress }}({{ item.parcelAddress }})</span>
        </v-tooltip>
        <div class="list-btn d-flex gap-2">
          <button
            class="btn list-btn btn-outline-primary btn-sm"
            @click="
              openConfirm(
                item.roadAddress == null
                  ? `${item.title}을(를) 등록하시겠습니까?`
                  : `${item.title} (${item.roadAddress})을(를) 등록하시겠습니까?`,
                'select',
                item.id,
                `${item.title} ${item.roadAddress} ${item.parcelAddress}`
              )
            "
          >
            등록
          </button>
          <button
            class="btn list-btn btn-outline-danger btn-sm"
            @click="openEdit(item)"
          >
            편집
          </button>
        <!-- confirm -->
        <v-dialog v-model="confirmDialog" max-width="400">
          <v-card>
            <v-card-title>확인</v-card-title>
            <v-card-text>{{ confirmMessage }}</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="dark" text @click="confirmDialog = false"
              >취소</v-btn
              >
              <v-btn color="primary" text @click="confirmYes">확인</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- 삭제 confirm -->
        <v-dialog v-model="edit" max-width="500">
            <v-card>
              <v-card-title>편집</v-card-title>
              <v-card-text><input v-model="editing.title" type="text"></input></v-card-text>
              <v-card-actions>
                <v-btn
                  color="danger"
                  @click="
                    openConfirm(
                      '선택한 지역을 삭제하시겠습니까?',
                      'remove',
                      editing.id
                    )
                  "
                  >삭제</v-btn
                >
                <v-spacer />
                <v-btn color="dark" text @click="edit = false"
                  >취소</v-btn
                >
                <v-btn color="primary" text @click="confirmEdit">수정</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- alert -->
          <v-dialog v-model="alertDialog.visible" max-width="400">
            <v-card>
              <v-card-title>알림</v-card-title>
                <v-card-text>{{ alertDialog.message }}</v-card-text>
                <v-card-actions>
                <v-spacer />
                <v-btn color="primary" text @click="alertDialog.visible = false">확인</v-btn>
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
  height: 40vh;
  overflow-y: scroll;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  &::-webkit-scrollbar {
    display: none;
  }
}
.location-name {
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.location-name > strong {
  font-size: 18px;
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
@media (max-width: 640px) {
  .location-name {
    font-size: 20px;
  }
}
@media (max-width: 560px) {
  .location-name {
    font-size: 16px;
  }
}
@media (max-width: 480px) {
  .location-name {
    font-size: 20px;
  }
  .btn {
    font-size: 10px;
  }
  .list-btn {
    flex-direction: column;
  }
}
</style>
