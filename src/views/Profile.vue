<script setup>
import { reactive } from 'vue';
import { profile } from '@/services/accountService';


const state = reactive({
    form: {
        memberId: '',
        email: '',
        name: '',
        birthDate: '',
        memberNick: '',
    }
})
</script>

<template>
  <div>
    <p>회원정보</p>
  </div>
</template>

<style scoped></style>

