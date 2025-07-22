<script setup>
import Layout from './views/layout/Layout.vue';

import { useRoute } from 'vue-router';
import { watch, onMounted } from 'vue';
import { useAccountStore } from './stores/counter';
import { check } from './services/accountService';

const route = useRoute();
const counter = useAccountStore();

// console.log('z', counter);
const checkAccount = async () => {
  console.log('로그인 체크');

  try {
    const res = await check();
    // console.log('res:', res);
    if (!res || res.status != 200) {
      counter.setChecked(false);
      return;
    }
    counter.setChecked(true);
    counter.setLoggedIn(res.data > 0);
  } catch (e) {
    console.error('check 에러:', e);
    counter.setChecked(false);
  }

};

onMounted(() => {
  checkAccount();
  counter.setChecked(false);
});
watch(
  () => route.path,
  () => {
    checkAccount();
  }
);
</script>
<template>
  <div class="layout">
    <Layout />
  </div>
</template>

<style>
.layout {
  width: 100%;
  min-height: 100vh;
}
</style>
