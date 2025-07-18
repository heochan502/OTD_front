<script setup>
import { ref } from 'vue';
const value = ref(60);

const  valueDeterminate =20;
</script>

<template>





<div class="progress bigpro progress-container"
    role="progressbar"
    aria-label="Animated striped example">
    <div
      class="progress-bar progress-bar-striped progress-bar-animated"
      :style="{ width: value + '%' }"></div>
  </div>
<div class="d-flex test2">
  <v-progress-linear class="test  "  color="blue"
      height="20"
      value="30" v-model="valueDeterminate"></v-progress-linear>
    </div>
    <div class="d-flex test3 justify-content">
    <v-progress-linear class="test5  "  color="yellow"
      height="20"
      value="30" v-model="valueDeterminate"></v-progress-linear>
      <v-progress-linear class="test5  "  color="green"
      height="20"
      value="30" v-model="valueDeterminate"></v-progress-linear>
      <v-progress-linear class="test5  "  color="red"
      height="20"
      value="30" v-model="valueDeterminate"></v-progress-linear>
    </div>
  <h1>여기서 부터 시작</h1>
  <div
    class="progress-container bigpro"
    role="progressbar"
    aria-label="Animated striped example">
    <div
      class="progress-bar progress-bar-animated text-bg-info"
      :style="{ width: value + '%' }">
      {{ value }}%
    </div>
  </div>
 

  <div class="d-flex miniprogroup">
    <div class="progress-container progress2 minipro">
      <div
        class="progress-bar text-bg-info"
        :style="{ width: value + '%' }"
      ></div>
    </div>
    <div class="progress-container progress3 minipro">
      <div
        class="progress-bar text-bg-info"
        :style="{ width: value + '%' }"
      ></div>
    </div>
    <div class="progress-container progress4 minipro">
      <div
        class="progress-bar text-bg-info"
        :style="{ width: value + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  margin: 30px;
  width: 50%;
  height: 20px;
  border: 0.1px solid rgb(122, 120, 120);
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
}
.progress-container:last-child {
  margin-right: 0;
}
.bigpro {
  margin: 30px 30px 30px;
}
.minipro {
  margin: 10px;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease-in-out;
}
.progress2 {
  width: 14%;
  margin: 10px 30px 30px 45px;
}
.progress3 {
  width: 14%;
}
.progress4 {
  width: 14%;
}
.test{
  width: 50%;
  background-color: #fff;
  border-radius: 15px;
  border: 0.1px solid rgb(122, 120, 120);
}
.test5{
  width: 16%;
  background-color: #fff;
  border-radius: 15px;
  border: 0.1px solid rgb(122, 120, 120);
}

.test2 {
  margin: 30px;
  
}
.test3 {
  margin: 30px 30px 30px 31px ;
  display: grid;
  grid-template-columns: 1fr 1fr;  
  grid-gap: 10px;
  
  
}

</style>
