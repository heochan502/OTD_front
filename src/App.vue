
<script setup>
import Layout from './views/layout/Layout.vue';
import { watch , onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { check } from './services/accountService';
import { useAccountStore } from './stores/counter';

const route = useRoute();
const account = useAccountStore();
//로그인 여부 확인 
const checkAccount = async () => {
    console.log('로그인 체크');
    const res = await check();
    console.log('res:', res);
    if(res === undefined || res.status != 200) {
      account.setChecked(false);
        return;
    } 
    account.setChecked(true);
    account.setLoggedIn(res.data > 0);    
}

onMounted(()=>{
    checkAccount();
})

watch(()=> route.path,()=> {
    checkAccount();
})
</script>

<template>
  <template v-if="account.state.checked"></template>
  <template v-else>
        서버 통신 오류
     </template>
  <div class="layout">
    <Layout />
  </div>
</template>

<style scoped>
.layout {
  width: 100%;
  min-height: 100vh;
}
</style>