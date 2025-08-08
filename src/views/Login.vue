<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/accountService';


const router = useRouter();

const state = reactive({
  form: {
    memberId: '',
    memberPw: '',
  },
});

const submit = async () => {
  const res = await login(state.form);
  console.log(res);
  switch (res.status) {
    case 200:
      await router.push('/');
      break;
    case 404:
      alert('아이디/비밀번호를 확인해 주세요!');
      break;
    case 500:
      alert('아이디/비밀번호를 확인해 주세요')
  }
};
</script>

<template>

  <div class="login-page">
    <div class="form-container">
      <h2 class="title">로그인</h2>
      <form @submit.prevent="submit" class="login-form">
        <div class="form-group">
          <label for="memberId">아이디</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="memberId"
              placeholder="아이디를 입력해 주세요"
              v-model="state.form.memberId"
            />
          </div>
          <div class="form-group">
            <label for="memberPw">비밀번호</label>
            <input
              type="password"
              id="memberPw"
              placeholder="비밀번호를 입력해주세요"
              v-model="state.form.memberPw"
            />
          </div>
        </div>
        <button type="submit" class="btn-submit">로그인</button>
        <div class="already">
           <p class="log">아직 가입하지 않으셨다면</p>
           <router-link to="/signup" class="go-join">회원가입</router-link>
        </div>
      </form>
    </div>
  </div>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

* {
  box-sizing: border-box;
}

.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  min-height: 30vh;
  font-family: 'Noto Sans KR', sans-serif;
  padding: 40px 0px;
}
.form-container {
  width: 100%;
  max-width: 500px;
  background: #fff;
  padding: 35px 28px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #333;
}
.login-form .form-group {
  margin-bottom: 18px;
}

.login-form label {
  display: block;
  margin: 3.5px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.login-form input {
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
}

.login-form input:focus {
  border-color: #2a9df4;
  box-shadow: 0 0 0 3px rgba(42, 157, 244, 0.15);
}

.btn-submit {
  width: 100%;
  padding: 14px 0;
  background: #2a9df4;
  color: #fff;
  font-size: 17px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: #1c7fd1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 157, 244, 0.3);
}

.already {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 15px;
}

.log {
  color: #666;
  margin: 0;
}

.go-join {
  color: #2a9df4;
  text-decoration: none;
  font-weight: 500;
}
</style>