<script setup>
import { ref } from "vue";
const tab = ref("null");
</script>

<template>
  <!-- 레이아웃 -->
  <div class="container layout">
    <main>
      <!-- 상단 -->
      <div class="main_top">
        <!-- 리포트영역 -->
        <div class="report justify-center">
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
                <v-tabs-window-item value="one">
                  운동리포트 내용
                </v-tabs-window-item>
                <v-tabs-window-item value="two">
                  건강리포트 내용
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card-text>
          </v-card>
        </div>
        <!-- 달력영역 -->
        <div>달력</div>
      </div>
      <!-- 하단 -->
      <div class="main_bottom">
        <!-- 운동기록목록 -->
        <div class="log_list">
          <div class="log_list_top">
            <div class="log_title">운동기록</div>
            <router-link to="/elog/add"
              ><i class="bi bi-plus-circle"></i
            ></router-link>
          </div>
          <div class="health_list_log">운동기록 리스트</div>
          <router-link to="/elog/1">운동기록상세보기 임시</router-link>
        </div>
        <!-- 건강기록목록 -->
        <div class="log_list">
          <div class="log_list_top">
            <div class="log_title">건강기록</div>
            <router-link to="/hlog/add"
              ><i class="bi bi-plus-circle"></i
            ></router-link>
          </div>
          <div class="health_list_log">건강기록 리스트</div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 50px 50px 30px;
}
.main_top {
  display: flex;
  justify-content: space-between;

  .card {
    justify-content: center;
    width: 380px;
  }
}
.main_bottom {
  display: flex;
  justify-content: space-between;
  .log_list_top {
    display: flex;
    justify-content: space-between;
  }
}
</style>
