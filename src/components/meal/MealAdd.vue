<script setup>
import { reactive, ref, watch } from 'vue';
import { debounce } from 'lodash';
const searchQuery = reactive({
  foodName: '',
});

const items = reactive({
    foodname:[],
})

const getItems = async(searchFood)=>
{
    items = await getItems(searchFood);
}
const search = () => {
  console.log(searchQuery.foodName);
};

// 아래는 입력창에 글을 쓰거나 뭘하면 바로바로 받아 들이긴하지만 
// 시간 텀을 줘서 그 시간 동안 변하는 것에 대한 것을 무시하게 하는 것
 // 1초 후 실행
const changeText =  debounce((value)=>{
    const searchFood = value;
    console.log('foodName change:', searchFood);
    getItems(searchFood);
}, 1000);



</script>

<template>
  <div class="d-flex flex-row">
    <v-combobox
      v-model="searchQuery.foodName"
      :items='items'
      @update:model-value="changeText"
      label="음식명을 입력하세요"
      variant="solo-inverted"
      placeholder="음식명"
      append-icon="mdi-magnify"
      @click:append="search"
      @keyup.enter="search"
    ></v-combobox>
  </div>
</template>

<style scoped></style>
