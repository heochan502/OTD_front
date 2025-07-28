<script setup>
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  join,
  checkMemberId,
  checkEmail,
  checkNickname,
} from '@/services/accountService';

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
  },
  // 약관 아코디언 상태 추가
  termsExpanded: {
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
  },
});
//비밀번호 확인
const isPasswordMatch = computed(() => {
  return state.form.memberPw && state.form.memberPw === state.form.memberPw2;
});
//약관동의
const allCheck = () => {
  const value = state.terms.all;
  state.terms.terms1 = value;
  state.terms.terms2 = value;
  state.terms.terms3 = value;
  state.terms.terms4 = value;
};

const updateAllCheck = () => {
  state.terms.all =
    state.terms.terms1 &&
    state.terms.terms2 &&
    state.terms.terms3 &&
    state.terms.terms4;
};

const toggleTerms = (termKey) => {
  state.termsExpanded[termKey] = !state.termsExpanded[termKey];
};
//아이디,이메일,닉네임 체크
const checkDuplicateId = async () => {
  const trimmedId = state.form.memberId.trim();
  console.log('아이디 체크:', trimmedId);

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
    console.log('중복확인 응답:', res);
    if (res.status === 200) {
      state.validation.memberIdChecked = true;
      state.validation.memberIdAvailable = res.data.available;
      state.validation.memberIdMessage = res.data.message;
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

const checkDuplicateEmail = async () => {
  const trimmedEmail = state.form.email.trim();

  console.log('이메일 체크:', trimmedEmail);

  if (!trimmedEmail) {
    alert('이메일을 입력해주세요.');
    return;
  }

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

const checkDuplicateNickname = async () => {
  const trimmedNick = state.form.memberNick.trim();

  console.log('닉네임 체크:', trimmedNick);

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

//중복확인 초기화
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

const submit = async () => {
  if (!isPasswordMatch.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  if (
    !state.validation.memberIdChecked ||
    !state.validation.memberIdAvailable
  ) {
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
        <div class="joininput">
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
              <button type="button" class="btn-small" @click="checkDuplicateId">
                중복확인
              </button>
            </div>
            <p
              v-if="state.validation.memberIdChecked"
              :class="[
                'validation-message',
                state.validation.memberIdAvailable ? 'success' : 'error',
              ]"
            >
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
            <p
              v-if="state.form.memberPw2"
              :class="[
                'validation-message',
                isPasswordMatch ? 'success' : 'error',
              ]"
            >
              {{
                isPasswordMatch
                  ? '비밀번호가 일치합니다.'
                  : '비밀번호가 일치하지 않습니다.'
              }}
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
              <button
                type="button"
                class="btn-small"
                @click="checkDuplicateEmail"
              >
                중복확인
              </button>
            </div>
            <p
              v-if="state.validation.emailChecked"
              :class="[
                'validation-message',
                state.validation.emailAvailable ? 'success' : 'error',
              ]"
            >
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
              <button
                type="button"
                class="btn-small"
                @click="checkDuplicateNickname"
              >
                중복확인
              </button>
            </div>
            <p
              v-if="state.validation.nickChecked"
              :class="[
                'validation-message',
                state.validation.nickAvailable ? 'success' : 'error',
              ]"
            >
              {{ state.validation.nickMessage }}
            </p>
          </div>
        </div>

        <div class="terms">
          <div class="terms-accordion">
            <div class="terms-item">
              <div
                class="terms-header"
                :class="{ active: state.termsExpanded.terms1 }"
                @click="toggleTerms('terms1')"
              >
                <input
                  type="checkbox"
                  v-model="state.terms.terms1"
                  @change="updateAllCheck('terms1')"
                  @click.stop
                />
                <span class="terms-title">[필수] 이용약관에 동의합니다.</span>
                <span
                  class="terms-arrow"
                  :class="{ active: state.termsExpanded.terms1 }"
                  >▼</span
                >
              </div>
              <div
                class="terms-content"
                :class="{ active: state.termsExpanded.terms1 }"
              >
                <div class="terms-text">
                  <h4>제1조 (목적)</h4>
                  <p>
                    이 약관은 회사가 제공하는 모든 서비스의 이용조건 및 절차,
                    회원과 회사의 권리, 의무, 책임사항과 기타 필요한 사항을
                    규정함을 목적으로 합니다.
                  </p>

                  <h4>제2조 (정의)</h4>
                  <p>
                    1. "서비스"라 함은 회사가 제공하는 모든 서비스를 의미합니다.
                  </p>
                  <p>
                    2. "회원"이라 함은 회사와 서비스 이용계약을 체결한 자를
                    의미합니다.
                  </p>
                  <p>
                    3. "아이디"라 함은 회원의 식별과 서비스 이용을 위하여 회원이
                    정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.
                  </p>

                  <h4>제3조 (약관의 효력 및 변경)</h4>
                  <p>
                    1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그
                    효력을 발생합니다.
                  </p>
                  <p>
                    2. 회사는 합리적인 사유가 발생할 경우 이 약관을 변경할 수
                    있으며, 약관이 변경되는 경우 지체 없이 공지합니다.
                  </p>
                </div>
              </div>
            </div>
            <div class="terms-item">
              <div
                class="terms-header"
                :class="{ active: state.termsExpanded.terms2 }"
                @click="toggleTerms('terms2')"
              >
                <input
                  type="checkbox"
                  v-model="state.terms.terms2"
                  @change="updateAllCheck('terms2')"
                  @click.stop
                />
                <span class="terms-title"
                  >[필수] 개인정보 수집 이용에 동의합니다.</span
                >
                <span
                  class="terms-arrow"
                  :class="{ active: state.termsExpanded.terms2 }"
                  >▼</span
                >
              </div>
              <div
                class="terms-content"
                :class="{ active: state.termsExpanded.terms2 }"
              >
                <div class="terms-text">
                  <h4>1. 개인정보의 처리목적</h4>
                  <p>
                    회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고
                    있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                    이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라
                    별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                  </p>

                  <h4>2. 개인정보의 처리 및 보유기간</h4>
                  <p>
                    ① 회사는 정보주체로부터 개인정보를 수집할 때 동의받은
                    개인정보 보유·이용기간 또는 법령에 따른 개인정보
                    보유·이용기간 내에서 개인정보를 처리·보유합니다.
                  </p>

                  <h4>3. 처리하는 개인정보의 항목</h4>
                  <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                  <p>- 필수항목: 이메일, 비밀번호, 이름, 연락처</p>
                  <p>- 선택항목: 생년월일, 성별</p>
                </div>
              </div>
            </div>
            <div class="terms-item">
              <div
                class="terms-header"
                :class="{ active: state.termsExpanded.terms3 }"
                @click="toggleTerms('terms3')"
              >
                <input
                  type="checkbox"
                  v-model="state.terms.terms3"
                  @change="updateAllCheck('terms3')"
                  @click.stop
                />
                <span class="terms-title">[필수] 서비스 이용 동의</span>
                <span
                  class="terms-arrow"
                  :class="{ active: state.termsExpanded.terms3 }"
                  >▼</span
                >
              </div>
              <div
                class="terms-content"
                :class="{ active: state.termsExpanded.terms3 }"
              >
                <div class="terms-text">
                  <h4>서비스 이용 약관</h4>
                  <p>본 서비스를 이용함에 있어 다음 사항에 동의합니다.</p>

                  <h4>서비스 제공</h4>
                  <p>
                    1. 회사는 회원에게 안정적이고 지속적인 서비스를 제공하기
                    위해 노력합니다.
                  </p>
                  <p>
                    2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.
                  </p>

                  <h4>회원의 의무</h4>
                  <p>
                    1. 회원은 서비스 이용 시 관련 법령과 이 약관을 준수해야
                    합니다.
                  </p>
                  <p>
                    2. 회원은 타인의 권리를 침해하거나 불쾌감을 주는 행위를
                    해서는 안 됩니다.
                  </p>
                </div>
              </div>
            </div>
            <div class="terms-item">
              <div
                class="terms-header"
                :class="{ active: state.termsExpanded.terms4 }"
                @click="toggleTerms('terms4')"
              >
                <input
                  type="checkbox"
                  v-model="state.terms.terms4"
                  @change="updateAllCheck('terms4')"
                  @click.stop
                />
                <span class="terms-title">[선택] 이벤트 및 알림 동의</span>
                <span
                  class="terms-arrow"
                  :class="{ active: state.termsExpanded.terms4 }"
                  >▼</span
                >
              </div>
              <div
                class="terms-content"
                :class="{ active: state.termsExpanded.terms4 }"
              >
                <div class="terms-text">
                  <h4>이벤트 및 알림 수신 동의</h4>
                  <p>
                    회사에서 진행하는 각종 이벤트, 프로모션, 할인 혜택 등의
                    정보를 받아보실 수 있습니다.
                  </p>

                  <h4>제공 내용</h4>
                  <p>- 신규 회원 혜택 및 쿠폰</p>
                  <p>- 시즌별 이벤트 정보</p>
                  <p>- 특가 상품 및 할인 정보</p>
                  <p>- 생일 축하 메시지 및 특별 혜택</p>

                  <h4>알림 방법</h4>
                  <p>이메일, 문자메시지, 앱 푸시알림</p>

                  <p>
                    ※ 선택사항이므로 동의하지 않아도 서비스 이용에 제한이
                    없습니다.
                  </p>
                </div>
              </div>
            </div>
            <div class="agree-all-box">
              <input
                type="checkbox"
                id="allTerms"
                v-model="state.terms.all"
                @change="allCheck"
              />
              <label for="allTerms" class="agree-all-label"
                >약관 전체 동의</label
              >
            </div>
          </div>
        </div>
        <button type="submit" class="btn-submit">회원가입</button>
        <div class="bottom-links">
          <div class="already">
            <p class="log">이미 계정이 있으신가요?</p>
            <router-link to="/login" class="go-login">로그인</router-link>
          </div>
          <router-link to="/" class="goHome">홈화면으로</router-link>
        </div>
      </form>
    </div>
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

.form-group {
  margin-bottom: 18px;
}

.join-form label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.joininput input {
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s ease;
}

.joininput input:focus {
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
}

.agree-all-box {
  background: #f3f6f9;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.agree-all-box input[type='checkbox'] {
  width: 18px;
  height: 18px;
}

.agree-all-label {
  font-weight: 600;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  margin: 0;
}

.terms .agree-all {
  font-weight: 600;
  color: #000;
  margin-bottom: 12px;
  display: block;
}

.terms-accordion {
  margin-top: 0;
}

.terms-item {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.terms-item:hover {
  border-color: #2a9df4;
  box-shadow: 0 2px 8px rgba(42, 157, 244, 0.1);
}

.terms-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  gap: 10px;
}

.terms-header:hover {
  background: #f8f9fa;
}

.terms-header.active {
  background: #2a9df4;
  color: white;
}

.terms-title {
  flex: 1;
  font-weight: 500;
  font-size: 13px;
}

.terms-arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.terms-arrow.active {
  transform: rotate(180deg);
}

.terms-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.terms-content.active {
  max-height: 300px;
}

.terms-text {
  padding: 16px;
  background: white;
  border-top: 1px solid #e1e5e9;
  max-height: 260px;
  overflow-y: auto;
  font-size: 12px;
  line-height: 1.5;
  color: #666;
}

.terms-text h4 {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin: 12px 0 6px 0;
}

.terms-text h4:first-child {
  margin-top: 0;
}

.terms-text p {
  margin: 4px 0;
  line-height: 1.6;
}

.terms-text::-webkit-scrollbar {
  width: 4px;
}

.terms-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.terms-text::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.terms-text::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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

.go-login {
  color: #2a9df4;
  text-decoration: none;
  font-weight: 500;
}

.go-login:hover {
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

.terms li {
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
