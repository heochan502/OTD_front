<script setup>
import { ref } from 'vue';
import { searchApi } from '@/services/weather/locationService';

const keyword = ref('');
const results = ref([]);
const dialog = ref(false);
const confirmDialog = ref(false); // 주소 추가 확인 모달
const selectedItem = ref(null); // 선택된 주소 임시 저장

const searchLocation = async () => {
  if (!keyword.value || !keyword.value.toString().trim()) return;
  try {
    const res = await searchApi(keyword.value);
    results.value = res.data;
    dialog.value = true; // 검색하면 모달 열기
  } catch (e) {
    console.error('검색 실패:', e);
  }
};

const selectItem = (item) => {
  selectedItem.value = item;
  confirmDialog.value = true;
};

// 주소 저장
const confirmYes = async () => {
  if (!selectedItem.value) return;
  try {
    // 저장 API 호출 (localId 대신 lat/lon으로 저장도 가능)
    const res = await saveLocation(selectedItem.value);
    if (res.status === 200) {
      alert('주소가 저장되었습니다!');
    }
  } catch (e) {
    console.error('저장 실패:', e);
  } finally {
    confirmDialog.value = false;
    dialog.value = false; // 결과 모달도 닫음
  }
};
</script>

<template>
  <div class="search-box">
    <!-- 검색창 -->
    <v-text-field
      v-model="keyword"
      label="주소 검색"
      placeholder="예) 그린컴퓨터학원"
      hide-details=""
      @keyup.enter="searchLocation"
      clearable
    />

    <!-- 검색 결과 모달 -->
    <v-dialog v-model="dialog" max-width="700">
      <v-card>
        <v-card-title>검색 결과</v-card-title>
        <v-card-text>
          <div class="result-list" v-if="results.length">
            <v-list>
              <v-list-item
                v-for="(item, idx) in results"
                :key="idx"
                @click="selectItem(item)"
              >
                <v-list-item-title>
                  <strong>{{ item.title }}</strong>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.road }} ({{ item.parcel }})
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
          <div v-else>검색 결과가 없습니다.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm 모달 -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title>확인</v-card-title>
        <v-card-text>
          {{ selectedItem?.road }}({{ selectedItem?.parcel }}) 을(를)
          추가하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="confirmDialog = false">취소</v-btn>
          <v-btn color="primary" text @click="confirmYes">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.search-box {
  margin-bottom: 0;
}
.result-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.v-list-item-subtitle {
  white-space: nowrap !important; /* 한줄 유지 */
  overflow: visible !important;
  text-overflow: unset !important;
}
.v-text-field {
  border: 1px solid #ddd;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
</style>
