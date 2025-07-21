<script setup>
import { ref } from "vue";
const tab = ref("null");
</script>

<template>
  <v-card class="card" width="400" height="300">
    <v-tabs
      v-model="tab"
      bg-color="#9DDEFF"
      color="#fff"
      grow
      style="border-radius: 25px 25px 0 0"
    >
      <v-tab value="one">운동 리포트</v-tab>
      <v-tab value="two">건강 리포트</v-tab>
    </v-tabs>
    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one"> 운동리포트 내용 </v-tabs-window-item>
        <v-tabs-window-item value="two"> 건강리포트 내용 </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.v-tab {
  font-size: 18px;
  color: #fff;
  font-weight: 600;
}
.v-tab.v-tab--selected {
  background-color: #3bbeff;
}
</style>
