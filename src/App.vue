<script setup>
import Layout from "./views/layout/Layout.vue";
import { useRoute, useRouter } from "vue-router";
import { watch, onMounted } from "vue";
import { useAccountStore } from "./stores/counter";
import { check } from "./services/accountService";

const route = useRoute();
const router = useRouter();
const counter = useAccountStore();


const checkAccount = async () => {
  console.log("로그인 체크");
  const res = await check();
  if (res === null || res.status != 200) {
    counter.setChecked(false);
    counter.setLoggedIn(false);
    return false; 
  } else {
    counter.setChecked(true);
    counter.setLoggedIn(res.data > 0);
    counter.setLoggedInId(res.data);
    return res.data > 0;
  }
};

onMounted(async () => {
  const isLoggedIn = await checkAccount();
  if (!isLoggedIn) {
    router.push("/login");
  } else {
    router.push("/");
  }
});


watch(() => route.path,() => {
    checkAccount();
  }
);

</script>

<template>
  <div class="layout">
    <div v-if="isInitializing" class="loading-container">
      <div class="spinner"></div>
      <p>로딩 중...</p>
    </div>
    <Layout v-else />
  </div>
</template>

<style>
.layout {
  width: 100%;
  min-height: 100vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: "Noto Sans KR", sans-serif;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2a9df4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-container p {
  color: #666;
  font-size: 16px;
}
</style>