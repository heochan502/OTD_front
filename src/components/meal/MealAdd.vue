<script setup>
import { reactive, ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { debounce, toNumber } from 'lodash';
import { getFoodNames, getFoodCalorie, inputMealData } from '@/services/meal/mealService';
import { useCalorieCalcul } from '@/stores/mealStore';
import { useRouter } from 'vue-router';
import { useDayDefine } from "@/stores/mealStore";

const dayStore = useDayDefine();

const router = useRouter();

const meal = () => {
  router.push({ name: 'MealForm' });
};
 

// 음식이름 드랍박스용
const nameBox = ref(null);
// 카테고리용 드랍박스용
const categoryBox = ref(null);
const itemList = ref([]);

//검색 전용
const searchFood = reactive({
  foodName: '',
  foodCategory: '',
});

//검색후 데이터
const items = reactive({
  foodList: [],
  foodCategory: [],
});

const searchFoodName = async (type) => {
  // console.log("이게왜", searchFood);
  searchFood.foodName = searchFood.foodName === null ? '' : searchFood.foodName;
  // 드롭박스 클릭하고 난 뒤에 foodName이 객체화 되어서 이거 자체가 객체인지 판별하고 데이터 조작 하는 부분
  const dataToSend = {
    foodName: typeof searchFood.foodName === 'object' ? searchFood.foodName.foodName : searchFood.foodName,
    foodCategory: searchFood.foodCategory,
  };

  const res = await getFoodNames(dataToSend);

  console.log(" 이름 : ", res);
// 데이터 넣는곳 
  if (type === 'name' && Array.isArray(res)) {
    // null이 아닐떄만 아래 실행 
    if (searchFood.foodName) {
      // console.log('널확인 ', searchFood.foodName);

      items.foodList = res.map(item => ({
        foodDbId: item.foodDbId,
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

// 아래 value 나 append뒤에 적힌건 함수화해서 값넘겨서 값보고 그떄별로 다르게 표시되는거



// 현재 시간 
const currentTime = ref('');
const updateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const ampm = String(now.getHours() - 12 <= 0 ? '오전' : '오후');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${ampm} ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


onMounted(() => {
  updateTime(); // 컴포넌트가 마운트될 때 초기 시간 설정
  // console.log("시간 ", currentTime);
  setInterval(updateTime, 1000); // 1초마다 시간 업데이트

});

// 목록 추가
const onItemClick = (item) => {
  // console.log('드롭다운에서 클릭된 시점 아이템:', items);
  const foodInfo = item[0];

  console.log('드롭다운에서 클릭된 항목:', foodInfo);
  if (!itemList.value.some(item => item.foodDbId === foodInfo.foodDbId)) {
    itemList.value.push({
      foodDbId: foodInfo.foodDbId,
      foodName: foodInfo.foodName,
      calorie: foodInfo.calorie,
      amount: 0,
      totalCalorie :0
    });
  }
  console.log('배열에 넣는데:', itemList.value);
};

// 배열 데이터 삭제 
const removeItem = (index) => {
  itemList.value.splice(index, 1);
};
//칼로리 계산
const calcCalories = (item) => {
  const gram = item.amount || 0;
  item.totalCalorie = Math.round(((item.calorie / 100) * gram));
  return item.totalCalorie;
};

//meal 저장


const inputData = reactive({
  amount :[],
  foodDbId: [],
  totalCalorie: '',
  mealDay:'',
  mealBrLuDi:'',
});
const saveMeal = async()=>
{ 

  inputData.foodDbId = itemList.value.map((info) => info.foodDbId);
  inputData.amount = itemList.value.map((info) => info.amount ) ;
  inputData.totalCalorie = itemList.value.reduce((sum, item) => {
    return sum + item.totalCalorie;
  }, 0).toFixed(0);
  inputData.mealBrLuDi = dayStore.dayDefine === '0' ? '오전' : dayStore.dayDefine === '1' ? '점심' :'저녁'; 
  //현재 시간 기점이라 생각해야함
  inputData.mealDay = currentTime.value.slice(3, 13);
  
  const res = await inputMealData(inputData);
  if (res.status !== 200) {
    console.log("입력 ", res);
  }

};

const modifyMeal = async () => {

  inputData.foodDbId = itemList.value.map((info) => info.foodDbId);
  inputData.amount = itemList.value.map((info) => info.amount);
  inputData.totalCalorie = itemList.value.reduce((sum, item) => {
    return sum + item.totalCalorie;
  }, 0).toFixed(0);
  inputData.mealBrLuDi = dayStore.dayDefine === '0' ? '오전' : dayStore.dayDefine === '1' ? '점심' : '저녁';
  //현재 시간 기점이라 생각해야함
  inputData.mealDay = currentTime.value.slice(3, 13);

  // console.log("기존 데이터", itemList.value);
  // console.log("아이디 데이터", inputData);
  // console.log("날짜 데이터", dayStore.dayDefine);
  // console.log (itemList.value);
  const res = await inputMealData(inputData);
  if (res.status !== 200) {
    console.log("입력 ", res);
  }

};



</script>

<template>
  <div class="d-flex flex-column  mb-6 ">

    <div class=" text-grey-darken-1 mb-1 font-weight-bold flex-row ">
      <span class="   text-h3 font-weight-bold ">
        아침 메뉴
      </span>
      <!-- 아래는 배열객체의 값의 총합 -->
      <span class="   text-body-1 font-weight-bold  "> 오늘 냠냠 칼로리 총합
        {{itemList.reduce((sum, item) =>
        sum + item.totalCalorie, 0)}} kcal</span>
      <span class="ml-10  "> {{ currentTime }} </span>
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
        <v-combobox class="mt-1 w-100" ref="nameBox" v-model="searchFood.foodName" :items="items.foodList"
          item-title="foodName" item-value="foodName" label="음식명을 입력하세요" variant="solo-inverted" placeholder="음식명"
          append-icon="mdi-plus" @update:model-value="onNameInput" @click:append="onItemClick(items.foodList)"
          @keyup.enter="() => searchFoodName('name')">


          <template #append-inner>
            <v-icon class="mr-2" @click="() => searchFoodName('name')">mdi-magnify</v-icon>
            <!-- <v-icon @click="onHomeClick">mdi-plus</v-icon> -->
          </template>

          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" v-if="props.title" @click="">
              <!-- <span> {{ item }}</span> -->
              <v-list-item-title>
                {{ item.value.foodName }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-grey text-body-2 ml-auto d-flex justify-content-between">
                <span>기준 무게 100g/ml </span> <span>{{ item.raw.calorie || '0' }} kcal</span>
              </v-list-item-subtitle>
            </v-list-item>
          </template>

        </v-combobox>
      </v-col>
    </v-row>


    <v-virtual-scroll :items="itemList" class="mt-1  pa-3 mb-2 ">

      <template v-slot:default="{ item, index }">
        <div class="d-flex flex-column align-center  ">
          <v-card class=" mb-4  rounded-lx" style="width: 600px" variant="tonal">
            <v-card-title class="pl-5 pt-1">
              <div class="d-flex justify-space-between w-100 align-start">
                <!--  왼쪽: 음식 이름 + 기준 칼로리 -->
                <div class="d-flex flex-column pt-1">
                  <span class="text-body-4 font-weight-bold" color="black">{{ item.foodName.length > 20 ?
                    item.foodName.slice(0, 20) + '…' : item.foodName }}</span>
                  <span class="pt-1 text-body-2 text-darkgrey">100g 기준: {{ item.calorie }} kcal</span>
                </div>

                <!--  오른쪽: 양 입력 & 계산된 칼로리 -->
                <div class="d-flex flex-row align-end mt-2 ml-auto" style="width: 250px">
                  <div>
                    <v-text-field v-model.number="item.amount" label="먹은 양 (g/ml)" type="number" variant="underlined"
                      class="mb-1 mt-0 text-black " hide-details style="width: 80px;" />
                    <span class="text-body-4 font-weight-bold ">
                      총 칼로리: {{ calcCalories(item) }} kcal
                    </span>
                  </div>
                  <div>
                    <v-card-actions>
                      <v-btn icon color="blue" @click="removeItem(i)">
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
      <!-- </v-virtual-scroll> -->
      <!-- </div> -->
      <!-- </div> -->
      <!-- </template> -->
    </v-virtual-scroll>
    <div v-if="itemList.length === 0">
      <v-alert variant="tonal" type="info">추가된 음식이 없습니다.</v-alert>
    </div>
  </div>



  <v-btn class="mealsaday text-center " @click="meal">식단 홈으로</v-btn>

  <v-btn class="mealsaday text-center " @click="saveMeal">저장</v-btn>

  <v-btn class="mealsaday text-center " @click="modifyMeal">수정</v-btn>


</template>

<style scoped>
.scroll-container {
  height: 600px;
  /* 원하는 높이 */
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 8px;
}


.mealsaday {
  width: 150px;
  height: 70px;
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
</style>
