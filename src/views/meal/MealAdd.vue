<script setup>
import { reactive, ref, onMounted } from 'vue';
import { debounce, toNumber } from 'lodash';
import {
  getFoodNames,
  getFoodCalorie,
  inputMealData,
  getMealData,
  modifyMealdata,
  getWeekTotal,
} from '@/services/meal/mealService';
import { useRouter } from 'vue-router';
import {
  useDayDefine,
  useAlldayMeal,
  useCalorieCalcul,
  useWeeklyStore,
  useBaseDate,
} from '@/stores/mealStore';

import dayjs from 'dayjs';

import 'dayjs/locale/ko';

dayjs.locale('ko');

const dayStore = useDayDefine();
const weeklyData = useWeeklyStore();
const weekDay = useBaseDate();
const calorieData = useCalorieCalcul();


const router = useRouter();

const meal = () => {
  router.push({ name: 'MealForm' });
};

// 음식이름 드랍박스용
const nameBox = ref(null);
// 카테고리용 드랍박스용
const categoryBox = ref(null);
//데이터 입력 받고 정리 하는곳
const itemList = ref([]);

//검색 전용
const searchFood = reactive({
  foodName: '',
  foodCategory: '',
});

//검색후 데이터
// const items = useDayDefine();
const items = reactive({
  foodList: [],
  foodCategory: [],
});

const searchFoodName = async (type) => {
  // console.log("이게왜", searchFood);
  searchFood.foodName = searchFood.foodName === null ? '' : searchFood.foodName;
  // 드롭박스 클릭하고 난 뒤에 foodName이 객체화 되어서 이거 자체가 객체인지 판별하고 데이터 조작 하는 부분
  const dataToSend = {
    foodName:
      typeof searchFood.foodName === 'object'
        ? searchFood.foodName.foodName
        : searchFood.foodName,
    foodCategory: searchFood.foodCategory,
  };

  const res = await getFoodNames(dataToSend);

  // console.log(" 이름 : ", res);
  // 데이터 넣는곳
  if (type === 'name' && Array.isArray(res)) {
    // null이 아닐떄만 아래 실행
    if (searchFood.foodName) {
      // console.log('널확인 ', searchFood.foodName);

      items.foodList = res.map((item) => ({
        foodDbId: item.foodDbId,
        foodName: item.foodName,
        calorie: item.calorie,
      }));
    }
    // console.log('아이템', items);
  }
  if (type === 'category' && res) {
    // 아래만 중복 제거 되어있고 위는 없음
    items.foodCategory = res.map((item) => item.foodCategory);
  }
};

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
    if (type === 'name') {
      nameBox.value.isMenuActive = true;
    }
    if (type === 'category') {
      categoryBox.value.isMenuActive = true;
    }
  }, 50);
};

// 아래는 입력창에 글을 쓰거나 뭘하면 바로바로 받아 들이긴하지만
// 시간 텀을 줘서 그 시간 동안 변하는 것에 대한 것을 무시하게 하는 것
// 1초 후 실행
const changeText = debounce((type) => {
  // const searchFood = value;
  // console.log('foodName change:', searchFood);
  searchFoodName(type);
}, 50);

// 목록 추가
const onItemClick = (item) => {
  // console.log('드롭다운에서 클릭된 시점 아이템:', items);
  const foodInfo = item[0];

  // console.log('드롭다운에서 클릭된 항목:', foodInfo);
  if (!itemList.value.some((item) => item.foodDbId === foodInfo.foodDbId)) {
    itemList.value.push({
      foodDbId: foodInfo.foodDbId,
      foodName: foodInfo.foodName,
      calorie: foodInfo.calorie,
      amount: 0,
      totalCalorie: 0,
    });
  }
  // console.log('배열에 넣는데:', itemList.value);
};

// 배열 데이터 삭제
const removeItem = (index) => {
  // console.log('삭제할 인덱스:', index);
  itemList.value.splice(index, 1);
};
//칼로리 계산
const calcCalories = (item) => {
  const gram = item.amount || 0;
  item.totalCalorie = Math.round((item.calorie / 100) * gram);
  return item.totalCalorie;
};

//meal 저장

const inputData = useAlldayMeal();

const setItem = () => {
  inputData.dayMealCategory.foodDbId = itemList.value.map(
    (info) => info.foodDbId
  );
  inputData.dayMealCategory.amount = itemList.value.map((info) => info.amount);
  inputData.dayMealCategory.totalCalorie = itemList.value
    .reduce((sum, item) => {
      return sum + item.totalCalorie;
    }, 0)
    .toFixed(0);
  inputData.dayMealCategory.mealBrLuDi = dayStore.dayDefine;
  //선택한 시간 기점이라 생각해야함
  inputData.dayMealCategory.mealDay = calorieData.itemInfo.mealDay;
};

const saveMeal = async () => {
  // console.log("set전 inputData데이터", inputData.dayMealCategory);
  // console.log("set전 itemList데이터", itemList.value);

  setItem();

  // console.log("기존 데이터", itemList.value);
  // console.log("아이디 데이터", inputData.dayMealCategory);
  // console.log("날짜 데이터", dayStore.dayDefine);
  // console.log (itemList.value);

  const res = await inputMealData(inputData.dayMealCategory);
  if (inputData.dayMealCategory.foodDbId.length > 0) {
    saveText.value = '수정하기';
  }
  if (res.status !== 200) {
    // console.log('입력 ', res);
    // 주간 뿌려주는 데이터 변경
    const result = await getWeekTotal(weekDay.getWeekDate);
    console.log('수정하고 주간 데이터 변경 ', result.data);
    weeklyData.weeklyRawData = result.data;
  }
};

const updateMeal = async () => {
  setItem();
  // inputData.dayMealCategory.mealBrLuDi = dayStore.dayDefine;
  //현재 시간 기점이라 생각해야함
  // inputData.dayMealCategory.mealDay = currentTime.value.slice(3, 13);

  // console.log(' 수정데이터들/ : ', inputData.dayMealCategory);

  const resultModify = await modifyMealdata(inputData.dayMealCategory);

  if (itemList.value.length > 0) {
    saveText.value = '수정하기';

    // 주간 뿌려주는 데이터 변경
    const res = await getWeekTotal(weekDay.getWeekDate);
    // console.log("수정하고 주간 데이터 변경 ", res.data);
    weeklyData.weeklyRawData = res.data;
  } else {
    saveText.value = '저장하기';
  }
  // console.log('값:::', res);
};

const saveText = ref('저장하기');

// 모달 상태
const dialog = ref({
  visible: false,
  type: 'save', // 'save' or 'update'
});
// 모달 열기
const openDialog = (type) => {
  dialog.value.type = type;
  dialog.value.visible = true;
};

// 확인 버튼 클릭 시 실행
const confirmAction = () => {
  if (dialog.value.type === 'save') {
    saveMeal();
  } else {
    updateMeal();
  }
  dialog.value.visible = false;
};
// 화면 뿌리기

const getMeal = async () => {
  const getlist = {
    // 아침: Br  점심: Lu 저녁: Di
    mealBrLuDi: dayStore.dayDefine,
    mealDay: calorieData.itemInfo.mealDay,
  };
  console.log(" data들 : ",  calorieData.itemInfo);
  const lisData = await getMealData(getlist);

  if (Array.isArray(lisData) && lisData.length > 0) {
    saveText.value = '수정하기';
  } else {
    saveText.value = '저장하기';
  }
  // 가공해서 itemList에 넣기
  itemList.value = lisData.map((item) => ({
    foodDbId: item.foodDbId,
    foodName: item.foodName,
    calorie: item.calorie,
    amount: item.amount,

    totalCalorie: 0,
    allDayCalorie: item.allDayCalorie,
    mealBrLuDi: item.mealBrLuDi,
    totalFat: item.totalFat,
    totalCarbohydrate: item.totalCarbohydrate,
    totalProtein: item.totalProtein,
    mealDay: item.mealDay,
  }));

  // console.log(' data들 : ', dayStore.currentTime.slice(3, 13));
  // console.log(" 데이터", calorieData.itemInfo.mealDay);
  // 데이터 넣는곳
  // itemList.value.push({
  //   foodDbId: foodInfo.foodDbId,
  //   foodName: foodInfo.foodName,
  //   calorie: foodInfo.calorie,
  //   amount: 0,
  //   totalCalorie: 0,
  //   allDayCalorie: 0,
  //   mealBrLuDi: dayStore.dayDefine
  // });
};

// 화면 불러올떄
onMounted(async () => {
  dayStore.updateTime(); // 컴포넌트가 마운트될 때 초기 시간 설정
  // console.log("시간 ", currentTime);
  await getMeal();
  setInterval(dayStore.updateTime, 1000); // 1초마다 시간 업데이트 
});
</script>

<template>
  <div class="d-flex flex-column mb-6">
    <div>
      <div class="addText text-grey-darken-1 mb-1 font-weight-bold">
        <span class="menu text-h4 font-weight-bold text-md-h3">
          {{ dayStore.dayDefine }} 메뉴
        </span>
        <div class="sub_menu pl-sm-5 mt-1">
          <!-- 아래는 배열객체의 값의 총합 -->
          <span class="eat_calorie text-body-1 font-weight-bold ml-10">
            {{ dayjs(calorieData.itemInfo.mealDay).format('YYYY년 MM월 DD일 dddd') }}</span>
          <span class="eat_calorie2 text-body-1 font-weight-bold">
            먹은 칼로리{{
              itemList.reduce((sum, item) => sum + item.totalCalorie, 0)
            }}kcal
          </span>
          <span class="nowtime ml-sm-10">
            현재 시간 : {{ dayStore.currentTime }}
          </span>
        </div>
      </div>
      <v-row dense class="justify-center">
        <v-col cols="12" md="5">
          <v-combobox
            label="음식카테고리 입력하세요"
            class="mt-1 w-100"
            ref="categoryBox"
            v-model="searchFood.foodCategory"
            :items="items.foodCategory"
            rounded="xl"
            item-text="foodCategory"
            @click="onCategoryInput"
            @update:model-value="onCategoryInput"            
            variant="solo-inverted"            
            placeholder="음식카테고리"
            color="info"
            @keyup.enter="() => searchFoodName('category')"
          >
            <template #append-inner>
              <v-icon class="mr-2" @click="() => searchFoodName('category')"
                >mdi-magnify</v-icon
              >
              <!-- <v-icon @click="onHomeClick">mdi-plus</v-icon> -->
            </template>
          </v-combobox>
        </v-col>
        <v-col cols="12" md="6">
          <v-combobox
            class="mt-1 w-100"
            ref="nameBox"
            v-model="searchFood.foodName"
            :items="items.foodList"
            rounded="xl"
            item-title="foodName"
            item-value="foodName"
            label="음식명을 입력하세요"
            variant="solo-inverted"
            placeholder="음식명"
            color="info"
            append-icon="mdi-plus"
            @update:model-value="onNameInput"
            @click:append="onItemClick(items.foodList)"
            @keyup.enter="() => searchFoodName('name')"
          >
            <template #append-inner>
              <v-icon class="mr-2" @click="() => searchFoodName('name')"
                >mdi-magnify</v-icon
              >
              <!-- <v-icon @click="onHomeClick">mdi-plus</v-icon> -->
            </template>

            <template v-slot:item="{ item, props }">
              <v-list-item v-bind="props" v-if="props.title">
                <!-- <span> {{ item }}</span> -->
                <v-list-item-title>
                  {{ item.value.foodName }}
                </v-list-item-title>
                <v-list-item-subtitle
                  class="text-grey text-body-2 ml-auto d-flex justify-content-between"
                >
                  <span>기준 용량 100g/ml </span>
                  <span>{{ item.raw.calorie || '0' }} kcal</span>
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-combobox>
        </v-col>
      </v-row>
    </div>

    <v-virtual-scroll :items="itemList" class="mt-1 pa-3 mb-2 h-100">
      <template v-slot:default="{ item }">
        <div class=" d-flex flex-column align-center">
          <v-card
            class="mb-4 rounded-lx rounded-pill"
            style="width:70%"
            variant="tonal"

          >
            <v-card-title class=" pl-5 pt-1">
              <div class="drop_insert_items d-flex justify-space-between w-100 align-start">
                <!--  왼쪽: 음식 이름 + 기준 칼로리 -->
                <div class="d-flex flex-column pt-1">
                  <span
                    class="md_text_foodname text-body-4 font-weight-bold"
                    color="black"
                    >{{
                      item.foodName.length > 20
                        ? item.foodName.slice(0, 20) + '…'
                        : item.foodName
                    }}</span
                  >
                  <span
                    class=" sm_text_foodname  text-body-4 font-weight-bold p-2 "
                    color="black"
                    >{{
                      item.foodName.length > 7
                        ? item.foodName.slice(0, 6) + '…'
                        : item.foodName
                    }}</span
                  >
                  <span class="p-2 pt-1 text-body-2 text-darkgrey"
                    >100g 기준: {{ item.calorie }} kcal</span
                  >
                </div>

                <!--  오른쪽: 양 입력 & 계산된 칼로리 -->
                <div
                  class="d-flex flex-row align-center mt-2 ml-auto justify-end"
                  style="width: 100%"
                >
                  <div>
                    <v-text-field
                      v-model.number="item.amount"
                      label="먹은 양 (g/ml)"
                      type="number"
                      variant="underlined"
                      class="p-2mb-1 mt-0 text-black"
                      hide-details
                      style="width: 80px"
                    />
                    <span class="text-body-4 font-weight-bold">
                      총 칼로리: {{ calcCalories(item) }} kcal
                    </span>
                  </div>
                  <div>
                    <v-card-actions  class="pa-0">
                      <v-btn
                     
                        icon
                        color="blue"
                        @click="removeItem(itemList.indexOf(item))"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </div>
                </div>
              </div>
            </v-card-title>
          </v-card>
        </div>
      </template>
    </v-virtual-scroll>
    <div v-if="itemList.length === 0">
      <v-alert variant="tonal" type="info">추가된 음식이 없습니다.</v-alert>
    </div>
  </div>

  <div class="d-flex flex-row align-end justify-end">
    <v-btn class="mealsaday text-center text-body-3" @click="meal"
      >식단 홈으로</v-btn
    >

    <v-btn
      class="mealsaday text-center ml-5 text-body-3"
      @click="openDialog(saveText === '저장하기' ? 'save' : 'update')"
      >{{ saveText }}</v-btn
    >
  </div>

  <v-dialog v-model="dialog.visible" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">
        {{ dialog.type === 'save' ? '저장' : '수정' }} 확인
      </v-card-title>
      <v-card-text>
        {{ dialog.type === 'save' ? '저장하시겠습니까?' : '수정하시겠습니까?' }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog.visible = false">취소</v-btn>
        <v-btn color="primary" @click="confirmAction">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- <v-btn class="mealsaday text-center " @click="modifyMeal">수정</v-btn> -->
</template>

<style scoped>
.addText {
  flex-direction: row;
}
.scroll-container {
  height: 600px;
  /* 원하는 높이 */
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 8px;
}

.mealsaday {
  width: 150px;
  height: 60px;
  background-color: #3bbeff;
  color: white;
  border: none;
  font-weight: 1000;
  font-size: 15px;
  font-family: 'Noto Sans KR', sans-serif;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 50px;
}

.md_text_foodname 
{
  padding-top: 10px;
  display:flex;
  /* justify-self: center; */ 
}
.sm_text_foodname{
  display: none;
}


/* 작은 화면: 글자 옆으로 */
@media (max-width: 760px) {
  .sub_menu {
    display: flex;
    flex-direction: column;
    justify-self: end;
  }
  .eat_calorie2 ,
  .eat_calorie{
    text-align: end;
  }

  .md_text_foodname 
{
  display: none;
}
.sm_text_foodname{
  display: inline;
}
.drop_insert_items{
  display: flex;
  
  flex-direction: row;
}
}
@media (max-width: 425) {
}

@media (max-width: 375px) {
}
@media (max-width: 325px) {
}
</style>
