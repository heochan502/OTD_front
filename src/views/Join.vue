<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { join, checkMemberId, checkEmail, checkNickname } from '@/services/accountService';

const router = useRouter();

const state = reactive({
  form: {
    memberId: '',
    memberPw: '',
    memberPw2: '',
    email: '',
    name: '',
    birthDate: '',
    memberNick: '',
  },
  validation: {
    memberIdChecked: false,
    memberIdAvailable: false,
    memberIdMessage: '',
    emailChecked: false,
    emailAvailable: false,
    emailMessage: '',
    nickChecked: false,
    nickAvailable: false,
    nickMessage: '',
  },
  terms: {
    all: false,
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
  }
});

// 비밀번호 일치 확인
const isPasswordMatch = computed(() => {
  return state.form.memberPw && state.form.memberPw === state.form.memberPw2;
});

// 전체 동의 체크박스 처리
const handleAllCheck = () => {
  const value = state.terms.all;
  state.terms.terms1 = value;
  state.terms.terms2 = value;
  state.terms.terms3 = value;
  state.terms.terms4 = value;
};

// 개별 체크박스 변경 시 전체 동의 업데이트
const updateAllCheck = () => {
  state.terms.all = state.terms.terms1 && state.terms.terms2 && 
                   state.terms.terms3 && state.terms.terms4;
};

// 아이디 중복 확인
const checkDuplicateId = async () => {
  // 공백 제거
  const trimmedId = state.form.memberId.trim();
  
  console.log('아이디 체크:', trimmedId); // 디버깅용
  
  if (!trimmedId) {
    alert('아이디를 입력해주세요.');
    return;
  }
  
  if (trimmedId.length < 4) {
    alert('아이디는 4자 이상이어야 합니다.');
    return;
  }
  
  try {
    const res = await checkMemberId(trimmedId);
    console.log('중복확인 응답:', res); // 디버깅용
    
    if (res.status === 200) {
      state.validation.memberIdChecked = true;
      state.validation.memberIdAvailable = res.data.available;
      state.validation.memberIdMessage = res.data.message;
      
      // alert로도 알림
      if (res.data.available) {
        alert('사용 가능한 아이디입니다.');
      } else {
        alert('이미 사용중인 아이디입니다.');
      }
    }
  } catch (error) {
    console.error('중복확인 에러:', error);
    alert('중복 확인 중 오류가 발생했습니다.');
  }
};

// 이메일 중복 확인
const checkDuplicateEmail = async () => {
  const trimmedEmail = state.form.email.trim();
  
  console.log('이메일 체크:', trimmedEmail); // 디버깅용
  
  if (!trimmedEmail) {
    alert('이메일을 입력해주세요.');
    return;
  }
  
  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    alert('올바른 이메일 형식이 아닙니다.');
    return;
  }
  
  try {
    const res = await checkEmail(trimmedEmail);
    if (res.status === 200) {
      state.validation.emailChecked = true;
      state.validation.emailAvailable = res.data.available;
      state.validation.emailMessage = res.data.message;
      
      // alert로도 알림
      if (res.data.available) {
        alert('사용 가능한 이메일입니다.');
      } else {
        alert('이미 사용중인 이메일입니다.');
      }
    }
  } catch (error) {
    console.error('이메일 중복확인 에러:', error);
    alert('중복 확인 중 오류가 발생했습니다.');
  }
};

// 닉네임 중복 확인
const checkDuplicateNickname = async () => {
  const trimmedNick = state.form.memberNick.trim();
  
  console.log('닉네임 체크:', trimmedNick); // 디버깅용
  
  if (!trimmedNick) {
    alert('닉네임을 입력해주세요.');
    return;
  }
  
  if (trimmedNick.length < 2) {
    alert('닉네임은 2자 이상이어야 합니다.');
    return;
  }
  
  try {
    const res = await checkNickname(trimmedNick);
    if (res.status === 200) {
      state.validation.nickChecked = true;
      state.validation.nickAvailable = res.data.available;
      state.validation.nickMessage = res.data.message;
      
      // alert로도 알림
      if (res.data.available) {
        alert('사용 가능한 닉네임입니다.');
      } else {
        alert('이미 사용중인 닉네임입니다.');
      }
    }
  } catch (error) {
    console.error('닉네임 중복확인 에러:', error);
    alert('중복 확인 중 오류가 발생했습니다.');
  }
};

// 입력값 변경 시 중복확인 상태 리셋
const resetIdValidation = () => {
  state.validation.memberIdChecked = false;
  state.validation.memberIdAvailable = false;
  state.validation.memberIdMessage = '';
};

const resetEmailValidation = () => {
  state.validation.emailChecked = false;
  state.validation.emailAvailable = false;
  state.validation.emailMessage = '';
};

const resetNickValidation = () => {
  state.validation.nickChecked = false;
  state.validation.nickAvailable = false;
  state.validation.nickMessage = '';
};

// 회원가입 제출
const submit = async () => {
  // 비밀번호 확인
  if (!isPasswordMatch.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  
  // 중복 확인 체크
  if (!state.validation.memberIdChecked || !state.validation.memberIdAvailable) {
    alert('아이디 중복 확인을 해주세요.');
    return;
  }
  
  if (!state.validation.emailChecked || !state.validation.emailAvailable) {
    alert('이메일 중복 확인을 해주세요.');
    return;
  }
  
  if (!state.validation.nickChecked || !state.validation.nickAvailable) {
    alert('닉네임 중복 확인을 해주세요.');
    return;
  }
  
  // 필수 약관 동의 확인
  if (!state.terms.terms1 || !state.terms.terms2 || !state.terms.terms3) {
    alert('필수 약관에 모두 동의해주세요.');
    return;
  }
  
  const res = await join(state.form);
  if (res.status === 200) {
    alert('회원가입을 축하합니다.');
    await router.push('/login');
  } else if (res.status === 409) {
    alert(res.data.message);
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
            <input
              type="text"
              id="memberId"
              placeholder="아이디를 입력해 주세요 (4자 이상)"
              v-model="state.form.memberId"
              @input="resetIdValidation"
            />
            <button type="button" class="btn-small" @click="checkDuplicateId">중복확인</button>
          </div>
          <p v-if="state.validation.memberIdChecked" 
             :class="['validation-message', state.validation.memberIdAvailable ? 'success' : 'error']">
            {{ state.validation.memberIdMessage }}
          </p>
        </div>

        <div class="form-group">
          <label for="memberPw">비밀번호 *</label>
          <input
            type="password"
            id="memberPw"
            placeholder="비밀번호를 입력해주세요"
            v-model="state.form.memberPw"
          />
        </div>
        <div class="form-group">
          <label for="memberPw2">비밀번호 확인*</label>
          <input
            type="password"
            id="memberPw2"
            placeholder="비밀번호를 한번더 확인해주세요"
            v-model="state.form.memberPw2"
          />
          <p v-if="state.form.memberPw2" :class="['validation-message', isPasswordMatch ? 'success' : 'error']">
            {{ isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.' }}
          </p>
        </div>

        <div class="form-group">
          <label for="email">이메일 *</label>
          <div class="input-wrapper">
            <input
              type="email"
              id="email"
              placeholder="이메일을 입력해 주세요"
              v-model="state.form.email"
              @input="resetEmailValidation"
            />
            <button type="button" class="btn-small" @click="checkDuplicateEmail">중복확인</button>
          </div>
          <p v-if="state.validation.emailChecked" 
             :class="['validation-message', state.validation.emailAvailable ? 'success' : 'error']">
            {{ state.validation.emailMessage }}
          </p>
        </div>

        <div class="form-group">
          <label for="name">이름 *</label>
          <input
            type="text"
            id="name"
            placeholder="이름을 입력해 주세요"
            v-model="state.form.name"
          />
        </div>

        <div class="form-group">
          <label for="birthDate">생년월일 *</label>
          <input
            type="text"
            id="birthDate"
            placeholder="YYYYMMDD"
            maxlength="8"
            v-model="state.form.birthDate"
          />
        </div>

        <div class="form-group">
          <label for="memberNick">닉네임 *</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="memberNick"
              placeholder="닉네임을 입력해 주세요 (2자 이상)"
              v-model="state.form.memberNick"
              @input="resetNickValidation"
            />
            <button type="button" class="btn-small" @click="checkDuplicateNickname">중복확인</button>
          </div>
          <p v-if="state.validation.nickChecked" 
             :class="['validation-message', state.validation.nickAvailable ? 'success' : 'error']">
            {{ state.validation.nickMessage }}
          </p>
        </div>

        <!-- 약관 동의 -->
        <div class="terms">
          <label class="agree-all">
            <input type="checkbox" v-model="state.terms.all" @change="handleAllCheck" /> 
            <span>약관 전체 동의</span>
          </label>
          <ul>
            <li>
              <input type="checkbox" v-model="state.terms.terms1" @change="updateAllCheck" /> 
              [필수] 이용약관에 동의합니다.
            </li>
            <li>
              <input type="checkbox" v-model="state.terms.terms2" @change="updateAllCheck" /> 
              [필수] 개인정보 수집 이용에 동의합니다.
            </li>
            <li>
              <input type="checkbox" v-model="state.terms.terms3" @change="updateAllCheck" /> 
              [필수] 서비스 이용 동의
            </li>
            <li>
              <input type="checkbox" v-model="state.terms.terms4" @change="updateAllCheck" /> 
              [선택] 이벤트 및 알림 동의
            </li>
          </ul>
        </div>

        <button type="submit" class="btn-submit">회원가입</button>
      </form>
    </div>
  </div>
  <div class="bottom-links">
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
  max-width: 540px;
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
  padding: 0 16px;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.btn-small:hover {
  background: #333;
}

.validation-message {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.validation-message.success {
  color: #2e7d32;
  background-color: #e8f5e9;
  border: 1px solid #a5d6a7;
}

.validation-message.error {
  color: #c62828;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
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

.bottom-links {
  margin-top: 20px;
  text-align: center;
}

.already {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.log {
  color: #666;
  margin: 0;
}

.goLogin {
  color: #2a9df4;
  text-decoration: none;
  font-weight: 500;
}

.goLogin:hover {
  text-decoration: underline;
}

.goHome {
  color: #666;
  text-decoration: none;
}

.goHome:hover {
  color: #333;
  text-decoration: underline;
}
</style>
