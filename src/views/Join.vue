<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { join } from '@/services/accountService';

const router = useRouter();

const state = reactive({
    form:{
        memberId: '',
        memberPw: '',
        email: '',
        name: '',
        birthDate: '',
        memberNick: '',
    }
});
const submit = async () => {
  const res = await join(state.form);
  console.log('res:', res);
  if (res.status === 200) {
    alert('회원가입을 축하합니다.');
    await router.push('/');
  }
};
</script>

<template>
  <div class="join">
    <div class="container">
      <form class="py-5 d-flex flex-column gap-3" @submit.prevent="submit">
        <h1 class="h5 mb-3">회원가입</h1>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="이름을 입력해 주세요"
            v-model="state.form.memberId" />
          <label for="memberId">아이디</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="memberPw"
            placeholder="비밀번호를 입력해주세요"
            v-model="state.form.memberPw"
            autocomplete="off" />
          <label for="loginPw">비밀번호</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="memberPwCheck"
            placeholder="비밀번호를 한번더 확인해주세요"
            v-model="state.form.memberPw"
            autocomplete="off" />
          <label for="memberPwCheck">비밀번호 확인</label>
        </div>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="email"
            placeholder="이메일을 입력해 주세요"
            v-model="state.form.email" />
          <label for="email">이메일</label>
        </div>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="이름을 입력해 주세요"
            v-model="state.form.name" />
          <label for="name">이름</label>
        </div>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="birthDate"
            placeholder="YYYYMMDD"
            v-model="state.form.birthDate" />
          <label for="birthDate">생년월일</label>
        </div>
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="memberNick"
            placeholder="닉네임"
            v-model="state.form.memberNick" />
          <label for="memberNick">닉네임</label>
        </div>

   
        <button class="w-100 h6 btn py-3 btn-primary">회원가입</button>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>