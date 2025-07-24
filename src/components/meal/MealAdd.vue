<script setup>
import { reactive, ref, watch  } from 'vue';
import { debounce } from 'lodash';
import { getFoodNames } from '@/services/meal/mealService';

const nameBox = ref(null);
const categoryBox = ref(null);
const categoryClick = ref(false);

const searchFood = reactive({
  foodName: '',
  foodCategory: '',
});

const items = reactive({
  foodName: [],
  foodCategory: [],
})

const searchFoodName = async (type) => {
  console.log(searchFood.foodCategory, searchFood.foodName);
  const res = await getFoodNames(searchFood);
  // console.log(JSON.stringify(items.foodName, null, 2));
  // 아래는 객체 형태로 받아와서 받아온걸 배열 형태로 수정하는것 (중복 제거 추가 )
  if (type ==='name'){
  items.foodName = [...new Set(res.map(item => item.foodName))];
  }
  if (type ==='category'){
    
    items.foodCategory = [...new Set(res.map(item => item.foodCategory))];}

  // items.foodname = Array.from(new Map(items.foodname.map(item => [item.foodName, item])).values());
  // console.log('items.foodname:', items.foodname);

};

// 무조건 박스 표출하기위한 forceopendropdown 
const onNameInput = () => {
  changeText('name');
  forceOpenDropdown('name');
};
// 다시 카테고리 눌렀을때 name 쪽 비워서 검색에 무리없게 만들기
const onCategoryInput = () => {
  changeText('category');
  searchFood.foodName ='';
  items.foodName=[];
  forceOpenDropdown('category');
};

const forceOpenDropdown = (type) => {
  setTimeout(() => {
    if (type === 'name' && nameBox.value) {
      nameBox.value.isMenuActive = true;
    }
    if (type === 'category' && categoryBox.value) {
      categoryBox.value.isMenuActive = true;
    }
  }, 100);
};

// 아래는 입력창에 글을 쓰거나 뭘하면 바로바로 받아 들이긴하지만 
// 시간 텀을 줘서 그 시간 동안 변하는 것에 대한 것을 무시하게 하는 것
// 1초 후 실행
const changeText = debounce((type) => {
  // const searchFood = value;
  // console.log('foodName change:', searchFood);
  searchFoodName(type);
}, 100);

// 아래 value 나 append뒤에 적힌건 함수화해서 값넘겨서 값보고 그떄별로 다르게 표시되는거
</script>

<template>
  <div class="d-flex flex-row">
    <v-combobox ref="categoryBox" v-model="searchFood.foodCategory" :items="items.foodCategory" item-text="foodCategory"
      @update:model-value="onCategoryInput" label="음식카테고리 입력하세요" variant="solo-inverted" placeholder="음식카테고리"
      append-icon="mdi-magnify" @click:append="()=>searchFoodName('category')" @keyup.enter="() => searchFoodName('category')"></v-combobox>
  </div>
  <div class="d-flex flex-row">
    <v-combobox ref="nameBox" v-model="searchFood.foodName" :items="items.foodName" item-text="foodName"
      @update:model-value="onNameInput" label="음식명을 입력하세요" variant="solo-inverted" placeholder="음식명"
      append-icon="mdi-magnify" @click:append="()=>searchFoodName('name')" @keyup.enter="() => searchFoodName('name')"
      ></v-combobox>
  </div>

</template>

<style scoped></style>
