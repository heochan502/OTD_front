<script setup>
import { reactive, ref, watch, computed } from 'vue';
import { debounce, toNumber } from 'lodash';
import { getFoodNames, getFoodCalorie } from '@/services/meal/mealService';
import { useCalorieCalcul } from '@/stores/mealStore';


const meal = () => {
  router.push({ name: 'Meal' });
};

const nameBox = ref(null);
const categoryBox = ref(null);
const calculStore = useCalorieCalcul();

const itemList = ref([]);

const searchFood = reactive({
  foodName: '',
  foodCategory: '',
});

const items = reactive({
  foodList: [],
  foodCategory: [],
})
const cal = '10'
const searchFoodName = async (type) => {

  // console.log("이게왜", searchFood);
  searchFood.foodName = searchFood.foodName === null ? ' ' : searchFood.foodName;
  // 드롭박스 클릭하고 난 뒤에 foodName이 객체화 되어서 이거 자체가 객체인지 판별하고 데이터 조작 하는 부분
  const dataToSend = {
    foodName: typeof searchFood.foodName === 'object' ? searchFood.foodName.foodName : searchFood.foodName,
    foodCategory: searchFood.foodCategory,
  };


  const res = await getFoodNames(dataToSend);

  // console.log(" 이름 : ", res);

  // 아래는 객체 형태로 받아와서 받아온걸 배열 형태로 수정하는것 (중복 제거 추가 )


  if (type === 'name' && Array.isArray(res)) {
    // null이 아닐떄만 아래 실행 
    if (searchFood.foodName) {
      // console.log('널확인 ', searchFood.foodName);
     
      items.foodList = res.map(item => ({
        foodName: item.foodName,
        calorie: item.calorie
      }));
    }
    // console.log('아이템', items);

  }
  if (type === 'category' && res) {
    // 아래만 중복 제거 되어있고 위는 없음 
    items.foodCategory = res.map(item => item.foodCategory);

  }
};

const calculFoodCalorie = async () => {

  console.log("칼로리쪽 : ", searchFood);
  calculStore.inputFoodInfo(await getFoodCalorie(searchFood));
  console.log("칼로리 스토어 전체 :", calculStore.itemInfo);
  console.log("배열 하나 : ", calculStore.getItemInfoByIndex(0));
}

// 무조건 박스 표출하기위한 forceopendropdown 
const onNameInput = async () => {
  changeText('name');
  forceOpenDropdown('name');
};
// 다시 카테고리 눌렀을때 name 쪽 비워서 검색에 무리없게 만들기
const onCategoryInput = async () => {
  changeText('category');
  searchFood.foodName = '';
  // items.foodList = [];
  await forceOpenDropdown('category');
};

const forceOpenDropdown = (type) => {
  setTimeout(() => {
    if (type === 'name' ) {
      nameBox.value.isMenuActive = true;
    }
    if (type === 'category') {
      categoryBox.value.isMenuActive = true;
    }
  }, 50);
};

// 음식 리스트가 비어있으면 가짜 항목 추가
// const displayFoodList = computed(() => {
//   return items.foodList.length > 0 ? items.foodList : [{ foodName: '음식 없음', calorie: '' }]
// })

// 아래는 입력창에 글을 쓰거나 뭘하면 바로바로 받아 들이긴하지만 
// 시간 텀을 줘서 그 시간 동안 변하는 것에 대한 것을 무시하게 하는 것
// 1초 후 실행
const changeText = debounce((type) => {
  // const searchFood = value;
  // console.log('foodName change:', searchFood);
  searchFoodName(type);
}, 50);

// 아래 value 나 append뒤에 적힌건 함수화해서 값넘겨서 값보고 그떄별로 다르게 표시되는거
const onItemClick = (item) => {
  // console.log('드롭다운에서 클릭된 항목:', item); 
  // console.log('드롭다운에서 클릭된 시점 아이템:', items);
  const rawItems = item.raw;
  itemList.value.push({ ...rawItems});
  // console.log('배열에 넣는데:', itemList.value);

  // return item;
  // 추가 로직
};

const removeItem = (index) => {
  itemList.value.splice(index, 1);
};
</script>

<template>
  <div class="d-flex flex-column  mb-6 ">

    <div>
      <span class="  text-grey-darken-1 mb-1 text-h3 font-weight-bold ">
        아침 메뉴
      </span>
      <!-- 아래는 배열객체의 값의 총합 -->
      <span> 오늘 드신 칼로리 총합 {{itemList.reduce((sum, item) => sum +  item.calorie, 0) }} kcal</span>
    </div>
    <v-row dense class="justify-center">
      <v-col cols="12" md="5">
        <v-combobox class="mt-1 w-100 " ref="categoryBox" v-model.trim="searchFood.foodCategory"
          :items="items.foodCategory" item-text="foodCategory" @update:model-value="onCategoryInput"
          label="음식카테고리 입력하세요" variant="solo-inverted" placeholder="음식카테고리"
          @keyup.enter="() => searchFoodName('category')">
          <template #append-inner>
            <v-icon class="mr-2" @click="() => searchFoodName('category')">mdi-magnify</v-icon>
            <!-- <v-icon @click="onHomeClick">mdi-plus</v-icon> -->
          </template>
        </v-combobox>

      </v-col>
      <v-col cols="12" md="6">
        <v-combobox class="mt-1 w-100" ref="nameBox" v-model.trim="searchFood.foodName" :items="items.foodList"
          item-title="foodName" item-value="foodName" label="음식명을 입력하세요" variant="solo-inverted" placeholder="음식명"
          append-icon="mdi-plus" @update:model-value="onNameInput" @click:append="onNameInput"
          @keyup.enter="onNameInput ">


          <template #append-inner>
            <v-icon class="mr-2" @click="() => searchFoodName('name')">mdi-magnify</v-icon>
            <!-- <v-icon @click="onHomeClick">mdi-plus</v-icon> -->
          </template>

          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" v-if="props.title" @click="onItemClick(item)">
              <!-- <span> {{ item }}</span> -->
              <v-list-item-title>
                {{ item.value.foodName }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-grey text-body-2 ml-auto d-flex justify-content-between">
                <span>기준 무게 100g </span> <span>{{ item.raw.calorie || '0' }} kcal</span>
              </v-list-item-subtitle>
            </v-list-item>
          </template>

        </v-combobox>
      </v-col>
    </v-row>




    <v-data-iterator :items="itemList" class="mt-1  pa-3 mb-4 ">
      <template v-slot:default="{ items }">
        <div v-if="items.length === 0">
          <v-alert type="info">추가된 음식이 없습니다.</v-alert>
        </div>
        <div v-else class="d-flex flex-column align-center ">
          <template v-for="(item, i) in items" :key="i">
            <v-card class="pa-3 mb-4" style="width: 700px">
              <v-card-title class="d-flex justify-space-between align-center">
                <div class="d-flex justify-space-between align-center w-100">
                  <span class="text-body-4 font-weight-bold">{{ item.raw.foodName.replaceAll('"', '') }}</span>
                  <span class="text-body-4 font-weight-bold">칼로리: {{ item.raw.calorie }} kcal</span>
                </div>
                <v-btn icon class="ml-5" color="blue" @click="removeItem(i)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-subtitle>
                100g 기준 칼로리: {{ item.raw.calorie }} kcal
              </v-card-subtitle>
            </v-card>
          </template>
        </div>
      </template>
    </v-data-iterator>
  </div>
  <button class="btn btn-primary mealsaday font-weight-black text-body-1" @click="meal">
    <span>식단 홈으로</span> <span>✚</span>
  </button>



</template>

    <style scoped>
  </style>
