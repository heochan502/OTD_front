<script setup>
import { reactive ,computed } from 'vue';
import { useRouter } from 'vue-router';
import { join } from '@/services/accountService';

const router = useRouter();

const state = reactive({
    form:{
        memberId: '',
        memberPw: '',
        memberPW2:'',
        email: '',
        name: '',
        birthDate: '',
        memberNick: '',
    }
});

const isPasswordMatch = computed(() => {
  return state.form.memberPw && state.form.memberPw === state.form.memberPw2
});

const submit = async () => {
  if (!isPasswordMatch.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  const res = await join(state.form);
  if (res.status === 200) {
    alert('회원가입을 축하합니다.');
    await router.push('/');
  } else {
    alert(`회원가입 실패: ${res.data?.message || '서버 오류'}`);
  }
};
</script>

<template>
  <div class="join-page">
    <div class="form-container">
      <h2 class="title">회원가입</h2>
      <form @submit.prevent="submit" class="join-form">
        <div class="form-group">
          <label for="memberId">아이디 *</label>
          <div class="input-wrapper">
            <input type="text" id="memberId" placeholder="아이디를 입력해 주세요" v-model="state.form.memberId" />
            <button type="button" class="btn-small">중복확인</button>
          </div>
        </div>
        <div class="form-group">
          <label for="memberPw">비밀번호 *</label>
          <input type="password" id="memberPw" placeholder="비밀번호를 입력해주세요" v-model="state.form.memberPw" />
        </div>
        <div class="form-group">
          <label for="memberPw2">비밀번호 확인*</label>
          <input type="password" id="memberPw2" placeholder="비밀번호를 한번더 확인해주세요" v-model="state.form.memberPw2" />
           <p :style="{ color: isPasswordMatch ? 'green' : 'red' }">
            {{ isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
          </p>
        </div>


        <div class="form-group">
          <label for="email">이메일 *</label>
          <div class="input-wrapper">
            <input type="email" id="email" placeholder="이메일을 입력해 주세요" v-model="state.form.email" />
            <button type="button" class="btn-small">중복확인</button>
          </div>
        </div>

        <div class="form-group">
          <label for="name">이름 *</label>
          <input type="text" id="name" placeholder="이름을 입력해 주세요" v-model="state.form.name" />
        </div>

        <div class="form-group">
          <label for="birthDate">생년월일 *</label>
          <input type="text" id="birthDate" placeholder="YYYYMMDD" v-model="state.form.birthDate" />
        </div>

        <div class="form-group">
          <label for="memberNick">닉네임 *</label>
          <div class="input-wrapper">
            <input type="text" id="memberNick" placeholder="닉네임을 입력해 주세요" v-model="state.form.memberNick" />
            <button type="button" class="btn-small">중복확인</button>
          </div>
        </div>

        <!-- 약관 동의 -->
        <div class="terms">
          <label class="agree-all">
            <input type="checkbox" /> <span>약관 전체 동의</span>
          </label>
          <ul>
            <li><input type="checkbox" /> [필수] 이용약관에 동의합니다.</li>
            <li><input type="checkbox" /> [필수] 개인정보 수집 이용에 동의합니다.</li>
            <li><input type="checkbox" /> [필수] 서비스 이용 동의</li>
            <li><input type="checkbox" /> [선택] 이벤트 및 알림 동의</li>
          </ul>
        </div>

        <button type="submit" class="btn-submit">회원가입</button>
      </form>
    </div>
  </div>
  <div>
          <div class="already">
          <p class="log">이미 계정이 있으신가요?</p>
            <router-link to="/login" class="goLogin">로그인</router-link>  
          </div>
          <router-link to="/" class="goHome">홈화면으로</router-link>  
        </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

.join-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f7fa;
  min-height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
  padding: 40px 0;
}

.form-container {
  width: 100%;
  max-width: 840px;
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

.join-form .form-group {
  margin-bottom: 18px;
}

.join-form label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.join-form input {
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
}

.join-form input:focus {
  border-color: #2a9df4;
  box-shadow: 0 0 0 3px rgba(42, 157, 244, 0.15);
}


.input-wrapper {
  display: flex;
  gap: 8px;
}

.btn-small {
  flex-shrink: 0;
  padding: 0 12px;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-small:hover {
  background: #333;
}

.terms {
  margin: 25px 0;
  font-size: 13px;
  color: #333;
  background: #f3f6f9;
  padding: 12px 15px;
  border-radius: 8px;
}

.terms .agree-all {
  font-weight: 600;
  color: #000;
  margin-bottom: 8px;
  display: block;
}

.terms ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}

.terms li {
  margin-bottom: 6px;
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

.log{
  color: #B9B9B9;
  text-align: center;
}
.already{
  display: flex;
  flex-direction: row;
  text-align: center;
  color: #5D5D5D;
}

</style>