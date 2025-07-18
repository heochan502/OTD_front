<script setup>
import { ref } from 'vue';
const value = ref(20);
</script>

<template>
  <h1>여기서 부터 시작</h1> 
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: value + '%' }"></div>
    </div>

    <div class="mt-0 mr-0 gap-0 row-gap-1 d-flex">      
        <div class="progress-container progress2 minipro">
          <div class="progress-bar" :style="{ width: value + '%' }">
            
          </div>
        </div>
          <div class="progress-container progress3 minipro">
          <div class="progress-bar" :style="{ width: value + '%' }"></div>
        </div>
          <div class="progress-container progress4 minipro">
          <div class="progress-bar" :style="{ width: value + '%' }"></div>
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
.minipro {
  margin: 10px
}
.small-progress {
  padding: -5px;
}
.progress-bar {

  height: 100%;
  background-color: #3bbeff;
  transition: width 0.3s ease-in-out;
}
.progress2 {
  width: 14%;
}
.progress3 {
  width: 14%;
}
.progress4 {
  width: 14%;
}
</style>
