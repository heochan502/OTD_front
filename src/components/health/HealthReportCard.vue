<script setup>
import { ref } from "vue";
const tab = ref("null");
</script>

<template>
  <v-card class="card">
    <v-tabs
      v-model="tab"
      bg-color="#3BBEFF"
      color="#fff"
      class="justify-center"
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

<style scoped></style>
