<script setup>
import { reactive, computed, watch, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import {
  join,
  checkMemberId,
  checkEmail,
  checkNickname,
} from '@/services/member/accountService';

// import { shallowRef } from 'vue'

const gender = shallowRef({ state: '성별', abbr: 'gender' });

const genders = [
  { state: '남자', abbr: 'male' },
  { state: '여자', abbr: 'Female' },
];

const router = useRouter();

const state = reactive({
  form: {
    memberId: '',
    memberPw: '',
    memberPw2: '',
    email: '',
    name: '',
    birthDate: '',
    gender: '',
    memberNick: '',
  },
  validation: {
    memberId: {
      isValid: true,
      message: '',
      touched: false,
      checked: false,
      available: false,
    },
    memberPw: {
      isValid: true,
      message: '',
      touched: false,
    },
    memberPw2: {
      isValid: true,
      message: '',
      touched: false,
    },
    email: {
      isValid: true,
      message: '',
      touched: false,
      checked: false,
      available: false,
    },
    name: {
      isValid: true,
      message: '',
      touched: false,
    },
    gender: {
      isValid: true,
      message: '',
      touched: false,
    },
    birthDate: {
      isValid: true,
      message: '',
      touched: false,
    },
    gender: {
      isValid: true,
      message: '',
      touched: false,
    },
    memberNick: {
      isValid: true,
      message: '',
      touched: false,
      checked: false,
      available: false,
    },
  },
  terms: {
    all: false,
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
  },
  termsExpanded: {
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
  },
  loading: false,
  saving: false,
  showSuccess: false,
  generalError: '',
});

const validateMemberId = (memberId) => {
  if (!memberId.trim()) {
    return { isValid: false, message: '아이디를 입력해주세요.' };
  }
  if (memberId.trim().length < 4) {
    return { isValid: false, message: '아이디는 4자 이상이어야 합니다.' };
  }
  if (memberId.trim().length > 20) {
    return {
      isValid: false,
      message: '아이디는 최대 20자까지 입력 가능합니다.',
    };
  }
  const idRegex = /^[a-zA-Z0-9_]+$/;
  if (!idRegex.test(memberId.trim())) {
    return {
      isValid: false,
      message: '아이디는 영문, 숫자, 언더스코어(_)만 사용 가능합니다.',
    };
  }
  return { isValid: true, message: '' };
};

const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: '비밀번호를 입력해주세요.' };
  }
  if (password.length < 2) {
    return { isValid: false, message: '비밀번호는 2자 이상이어야 합니다.' };
  }
  if (password.length > 20) {
    return {
      isValid: false,
      message: '비밀번호는 최대 20자까지 입력 가능합니다.',
    };
  }
  return { isValid: true, message: '' };
};

const validatePasswordConfirm = (password, passwordConfirm) => {
  if (!passwordConfirm) {
    return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
  }
  if (password !== passwordConfirm) {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }
  return { isValid: true, message: '비밀번호가 일치합니다.' };
};

const validateEmail = (email) => {
  if (!email.trim()) {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' };
  }
  if (email.length > 50) {
    return {
      isValid: false,
      message: '이메일은 최대 50자까지 입력 가능합니다.',
    };
  }
  return { isValid: true, message: '' };
};

const validateName = (name) => {
  if (!name.trim()) {
    return { isValid: false, message: '이름을 입력해주세요.' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: '이름은 최소 2글자 이상이어야 합니다.' };
  }
  if (name.trim().length > 20) {
    return {
      isValid: false,
      message: '이름은 최대 20글자까지 입력 가능합니다.',
    };
  }
  const nameRegex = /^[가-힣a-zA-Z\s]+$/;
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      message: '이름은 한글 또는 영문만 입력 가능합니다.',
    };
  }
  return { isValid: true, message: '' };
};

const validateBirthDate = (birthDate) => {
  if (!birthDate.trim()) {
    return { isValid: false, message: '생년월일을 입력해주세요.' };
  }
  const dateRegex = /^\d{8}$/;
  if (!dateRegex.test(birthDate.replace(/-/g, ''))) {
    return { isValid: false, message: 'YYYYMMDD 형식으로 입력해주세요.' };
  }

  const cleanDate = birthDate.replace(/-/g, '');
  const year = parseInt(cleanDate.substring(0, 4));
  const month = parseInt(cleanDate.substring(4, 6));
  const day = parseInt(cleanDate.substring(6, 8));

  const currentYear = new Date().getFullYear();

  if (year < 1900 || year > currentYear) {
    return { isValid: false, message: '올바른 연도를 입력해주세요.' };
  }
  if (month < 1 || month > 12) {
    return { isValid: false, message: '올바른 월을 입력해주세요.' };
  }
  if (day < 1 || day > 31) {
    return { isValid: false, message: '올바른 일을 입력해주세요.' };
  }

  const testDate = new Date(year, month - 1, day);
  if (
    testDate.getFullYear() !== year ||
    testDate.getMonth() !== month - 1 ||
    testDate.getDate() !== day
  ) {
    return { isValid: false, message: '존재하지 않는 날짜입니다.' };
  }

  if (testDate > new Date()) {
    return { isValid: false, message: '미래 날짜는 입력할 수 없습니다.' };
  }

  return { isValid: true, message: '' };
};
//성별 제약 조건

const validateGender = (inGender) => {
  if (inGender === '성별') {
    return { isValid: false, message: '성별을 입력해주세요.' };
  }
  state.gender = inGender.state;
  console.log('state.gender', state.gender);
  return { isValid: true, message: '' };
};

// 성별 제약 조건

const validateNickname = (nickname) => {
  if (!nickname.trim()) {
    return { isValid: false, message: '닉네임을 입력해주세요.' };
  }
  if (nickname.trim().length < 2) {
    return {
      isValid: false,
      message: '닉네임은 최소 2글자 이상이어야 합니다.',
    };
  }
  if (nickname.trim().length > 15) {
    return {
      isValid: false,
      message: '닉네임은 최대 15글자까지 입력 가능합니다.',
    };
  }
  const nicknameRegex = /^[가-힣a-zA-Z0-9_]+$/;
  if (!nicknameRegex.test(nickname.trim())) {
    return {
      isValid: false,
      message: '닉네임은 한글, 영문, 숫자, 언더스코어(_)만 사용 가능합니다.',
    };
  }
  return { isValid: true, message: '' };
};

const validateField = (field, value) => {
  let result;

  switch (field) {
    case 'memberId':
      result = validateMemberId(value);
      break;
    case 'memberPw':
      result = validatePassword(value);
      break;
    case 'memberPw2':
      result = validatePasswordConfirm(state.form.memberPw, value);
      break;
    case 'email':
      result = validateEmail(value);
      break;
    case 'name':
      result = validateName(value);
      break;
    case 'birthDate':
      result = validateBirthDate(value);
      break;
    case 'gender':
      result = validateGender(value);
      break;
    case 'memberNick':
      result = validateNickname(value);
      break;
    default:
      result = { isValid: true, message: '' };
  }

  state.validation[field] = {
    ...state.validation[field],
    isValid: result.isValid,
    message: result.message,
  };
};

const handleFieldTouch = (field) => {
  state.validation[field].touched = true;
  validateField(field, state.form[field]);
};

const isPasswordMatch = computed(() => {
  return state.form.memberPw && state.form.memberPw === state.form.memberPw2;
});

const passwordMatchStatus = computed(() => {
  if (!state.form.memberPw || !state.form.memberPw2) {
    return { show: false, isMatch: false, message: '' };
  }

  const isMatch = state.form.memberPw === state.form.memberPw2;
  return {
    show: true,
    isMatch,
    message: isMatch
      ? '비밀번호가 일치합니다.'
      : '비밀번호가 일치하지 않습니다.',
  };
});

watch(
  () => state.form.memberId,
  (newValue) => {
    if (state.validation.memberId.touched) {
      validateField('memberId', newValue);
    }
    resetIdValidation();
  }
);

watch(
  () => state.form.memberPw,
  (newValue) => {
    if (state.validation.memberPw.touched) {
      validateField('memberPw', newValue);
    }

    if (state.validation.memberPw2.touched) {
      validateField('memberPw2', state.form.memberPw2);
    }
  }
);

watch(
  () => state.form.memberPw2,
  (newValue) => {
    if (newValue) {
      state.validation.memberPw2.touched = true;
    }
    if (state.validation.memberPw2.touched) {
      validateField('memberPw2', newValue);
    }
  }
);

watch(
  () => state.form.email,
  (newValue) => {
    if (state.validation.email.touched) {
      validateField('email', newValue);
    }
    resetEmailValidation();
  }
);

watch(
  () => state.form.name,
  (newValue) => {
    if (state.validation.name.touched) {
      validateField('name', newValue);
    }
  }
);

watch(
  () => state.form.birthDate,
  (newValue) => {
    if (state.validation.birthDate.touched) {
      validateField('birthDate', newValue);
    }
  }
);

watch(
  () => gender.value,
  (newValue) => {
    if (newValue) {
      // console.log(newValue);
      validateField('gender', newValue);
    }
  }
);

watch(
  () => state.form.memberNick,
  (newValue) => {
    if (state.validation.memberNick.touched) {
      validateField('memberNick', newValue);
    }
    resetNickValidation();
  }
);

// 약관 동의 관련 함수들
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

const checkDuplicateId = async () => {
  const trimmedId = state.form.memberId.trim();

  if (!trimmedId) {
    return;
  }

  const validation = validateMemberId(trimmedId);
  if (!validation.isValid) {
    state.validation.memberId.touched = true;
    state.validation.memberId.isValid = false;
    state.validation.memberId.message = validation.message;
    return;
  }

  try {
    state.loading = true;
    const res = await checkMemberId(trimmedId);
    if (res.status === 200) {
      state.validation.memberId.checked = true;
      state.validation.memberId.available = res.data.available;

      if (res.data.available) {
        state.validation.memberId.message = '사용 가능한 아이디입니다.';
        state.validation.memberId.isValid = true;
      } else {
        state.validation.memberId.message = '이미 사용중인 아이디입니다.';
        state.validation.memberId.isValid = false;
      }
    }
  } catch (error) {
    console.error('중복확인 에러:', error);

    state.generalError = '중복 확인 중 오류가 발생했습니다.';
    setTimeout(() => (state.generalError = ''), 3000);
  } finally {
    state.loading = false;
  }
};

const checkDuplicateEmail = async () => {
  const trimmedEmail = state.form.email.trim();

  if (!trimmedEmail) {
    return;
  }

  const validation = validateEmail(trimmedEmail);
  if (!validation.isValid) {
    state.validation.email.touched = true;
    state.validation.email.isValid = false;
    state.validation.email.message = validation.message;
    return;
  }

  try {
    state.loading = true;
    const res = await checkEmail(trimmedEmail);
    if (res.status === 200) {
      state.validation.email.checked = true;
      state.validation.email.available = res.data.available;

      if (res.data.available) {
        state.validation.email.message = '사용 가능한 이메일입니다.';
        state.validation.email.isValid = true;
      } else {
        state.validation.email.message = '이미 사용중인 이메일입니다.';
        state.validation.email.isValid = false;
      }
    }
  } catch (error) {
    console.error('이메일 중복확인 에러:', error);

    state.generalError = '중복 확인 중 오류가 발생했습니다.';
    setTimeout(() => (state.generalError = ''), 3000);
  } finally {
    state.loading = false;
  }
};

const checkDuplicateNickname = async () => {
  const trimmedNick = state.form.memberNick.trim();

  if (!trimmedNick) {
    return;
  }

  const validation = validateNickname(trimmedNick);
  if (!validation.isValid) {
    state.validation.memberNick.touched = true;
    state.validation.memberNick.isValid = false;
    state.validation.memberNick.message = validation.message;
    return;
  }

  try {
    state.loading = true;
    const res = await checkNickname(trimmedNick);
    if (res.status === 200) {
      state.validation.memberNick.checked = true;
      state.validation.memberNick.available = res.data.available;

      if (res.data.available) {
        state.validation.memberNick.message = '사용 가능한 닉네임입니다.';
        state.validation.memberNick.isValid = true;
      } else {
        state.validation.memberNick.message = '이미 사용중인 닉네임입니다.';
        state.validation.memberNick.isValid = false;
      }
    }
  } catch (error) {
    console.error('닉네임 중복확인 에러:', error);

    state.generalError = '중복 확인 중 오류가 발생했습니다.';
    setTimeout(() => (state.generalError = ''), 3000);
  } finally {
    state.loading = false;
  }
};

const resetIdValidation = () => {
  state.validation.memberId.checked = false;
  state.validation.memberId.available = false;
  if (
    state.validation.memberId.touched &&
    state.validation.memberId.message.includes('사용')
  ) {
    state.validation.memberId.message = '';
  }
};

const resetEmailValidation = () => {
  state.validation.email.checked = false;
  state.validation.email.available = false;
  if (
    state.validation.email.touched &&
    state.validation.email.message.includes('사용')
  ) {
    state.validation.email.message = '';
  }
};

const resetNickValidation = () => {
  state.validation.memberNick.checked = false;
  state.validation.memberNick.available = false;
  if (
    state.validation.memberNick.touched &&
    state.validation.memberNick.message.includes('사용')
  ) {
    state.validation.memberNick.message = '';
  }
};

const isFormValid = () => {
  return (
    Object.values(state.validation).every((field) => field.isValid) &&
    state.validation.memberId.checked &&
    state.validation.memberId.available &&
    state.validation.email.checked &&
    state.validation.email.available &&
    state.validation.memberNick.checked &&
    state.validation.memberNick.available
  );
};

const submit = async () => {
  Object.keys(state.validation).forEach((field) => {
    state.validation[field].touched = true;
    validateField(field, state.form[field]);
  });

  if (
    !state.validation.memberId.checked ||
    !state.validation.memberId.available
  ) {
    state.generalError = '아이디 중복 확인을 해주세요.';
    setTimeout(() => (state.generalError = ''), 3000);
    return;
  }

  if (!state.validation.email.checked || !state.validation.email.available) {
    state.generalError = '이메일 중복 확인을 해주세요.';
    setTimeout(() => (state.generalError = ''), 3000);
    return;
  }

  if (
    !state.validation.memberNick.checked ||
    !state.validation.memberNick.available
  ) {
    state.generalError = '닉네임 중복 확인을 해주세요.';
    setTimeout(() => (state.generalError = ''), 3000);
    return;
  }

  if (!state.terms.terms1 || !state.terms.terms2 || !state.terms.terms3) {
    state.generalError = '필수 약관에 모두 동의해주세요.';
    setTimeout(() => (state.generalError = ''), 3000);
    return;
  }

  if (!isFormValid()) {
    state.generalError = '입력 정보를 다시 확인해주세요.';
    setTimeout(() => (state.generalError = ''), 3000);
    return;
  }

  state.saving = true;
  state.generalError = '';

  try {
    const res = await join(state.form);
    if (res.status === 200) {
      state.showSuccess = true;
      // alert 추가
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      setTimeout(async () => {
        await router.push('/login');
      }, 2000);
    } else if (res.status === 409) {
      state.generalError = res.data.message;
    } else {
      state.generalError = `회원가입 실패: ${res.data?.message || '서버 오류'}`;
    }
  } catch (error) {
    console.error('회원가입 에러:', error);
    state.generalError = '회원가입 중 오류가 발생했습니다: ' + error.message;
  } finally {
    state.saving = false;
  }
};
</script>

<template>
  <div class="join-page">
    <div class="form-container">
      <h2 class="title">회원가입</h2>

      <div v-if="state.showSuccess" class="success-message">
        <div class="message-icon">✓</div>
        <div>회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.</div>
      </div>

      <div v-if="state.generalError" class="error-message">
        <div class="message-icon">⚠</div>
        <div>{{ state.generalError }}</div>
      </div>

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
                :class="{
                  error:
                    state.validation.memberId.touched &&
                    !state.validation.memberId.isValid,
                  success:
                    state.validation.memberId.touched &&
                    state.validation.memberId.isValid &&
                    state.validation.memberId.available,
                }"
                @blur="handleFieldTouch('memberId')"
                @input="
                  state.validation.memberId.touched &&
                    validateField('memberId', state.form.memberId)
                "
              />
              <button
                type="button"
                class="btn-small"
                @click="checkDuplicateId"
                :disabled="state.loading"
              >
                <span v-if="state.loading">확인중...</span>
                <span v-else>중복확인</span>
              </button>
            </div>
            <div
              v-if="
                state.validation.memberId.touched &&
                state.validation.memberId.message
              "
              :class="[
                'field-message',
                state.validation.memberId.isValid &&
                state.validation.memberId.available
                  ? 'field-success'
                  : 'field-error',
              ]"
            >
              {{ state.validation.memberId.message }}
            </div>
          </div>

          <div class="form-group">
            <label for="memberPw">비밀번호 *</label>
            <input
              type="password"
              id="memberPw"
              placeholder="비밀번호를 입력해주세요(2자 이상)"
              v-model="state.form.memberPw"
              :class="{
                error:
                  state.validation.memberPw.touched &&
                  !state.validation.memberPw.isValid,
                success:
                  state.validation.memberPw.touched &&
                  state.validation.memberPw.isValid &&
                  state.form.memberPw,
              }"
              @blur="handleFieldTouch('memberPw')"
              @input="
                state.validation.memberPw.touched &&
                  validateField('memberPw', state.form.memberPw)
              "
            />
            <div
              v-if="
                state.validation.memberPw.touched &&
                state.validation.memberPw.message
              "
              :class="[
                'field-message',
                state.validation.memberPw.isValid
                  ? 'field-success'
                  : 'field-error',
              ]"
            >
              {{ state.validation.memberPw.message }}
            </div>
          </div>

          <div class="form-group">
            <label for="memberPw2">비밀번호 확인 *</label>
            <div class="password-confirm-wrapper">
              <input
                type="password"
                id="memberPw2"
                placeholder="비밀번호를 한번더 확인해주세요"
                v-model="state.form.memberPw2"
                :class="{
                  error: state.form.memberPw2 && !passwordMatchStatus.isMatch,
                  success:
                    passwordMatchStatus.show && passwordMatchStatus.isMatch,
                }"
                @blur="handleFieldTouch('memberPw2')"
                @input="
                  () => {
                    if (state.form.memberPw2) {
                      state.validation.memberPw2.touched = true;
                      validateField('memberPw2', state.form.memberPw2);
                    }
                  }
                "
              />
            </div>

            <div
              v-if="passwordMatchStatus.show"
              :class="[
                'field-message',
                'password-match-message',
                passwordMatchStatus.isMatch ? 'field-success' : 'field-error',
              ]"
            >
              {{ passwordMatchStatus.message }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">이메일 *</label>
            <div class="input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="이메일을 입력해 주세요"
                v-model="state.form.email"
                :class="{
                  error:
                    state.validation.email.touched &&
                    !state.validation.email.isValid,
                  success:
                    state.validation.email.touched &&
                    state.validation.email.isValid &&
                    state.validation.email.available,
                }"
                @blur="handleFieldTouch('email')"
                @input="
                  state.validation.email.touched &&
                    validateField('email', state.form.email)
                "
              />
              <button
                type="button"
                class="btn-small"
                @click="checkDuplicateEmail"
                :disabled="state.loading"
              >
                <span v-if="state.loading">확인중...</span>
                <span v-else>중복확인</span>
              </button>
            </div>
            <div
              v-if="
                state.validation.email.touched && state.validation.email.message
              "
              :class="[
                'field-message',
                state.validation.email.isValid &&
                state.validation.email.available
                  ? 'field-success'
                  : 'field-error',
              ]"
            >
              {{ state.validation.email.message }}
            </div>
          </div>

          <div class="form-group">
            <label for="name">이름 *</label>
            <input
              type="text"
              id="name"
              placeholder="이름을 입력해 주세요(한글, 영문 2자 이상)"
              v-model="state.form.name"
              :class="{
                error:
                  state.validation.name.touched &&
                  !state.validation.name.isValid,
                success:
                  state.validation.name.touched &&
                  state.validation.name.isValid &&
                  state.form.name,
              }"
              @blur="handleFieldTouch('name')"
              @input="
                state.validation.name.touched &&
                  validateField('name', state.form.name)
              "
            />
            <div
              v-if="
                state.validation.name.touched && state.validation.name.message
              "
              :class="[
                'field-message',
                state.validation.name.isValid ? 'field-success' : 'field-error',
              ]"
            >
              {{ state.validation.name.message }}
            </div>
            <div
              v-else-if="
                state.validation.name.touched &&
                state.validation.name.isValid &&
                state.form.name
              "
              class="field-success"
            >
              올바른 이름입니다.
            </div>
          </div>
          <!-- 생년 월일  -->
          <label for="birthDate">생년월일 *</label>
          <div id="" class="form-group gender">
            <div class="brithDateValide w-75">
              <input
                type="text"
                id="birthDate"
                placeholder="YYYYMMDD"
                maxlength="8"
                v-model="state.form.birthDate"
                :class="{
                  error:
                    state.validation.birthDate.touched &&
                    !state.validation.birthDate.isValid,
                  success:
                    state.validation.birthDate.touched &&
                    state.validation.birthDate.isValid &&
                    state.form.birthDate,
                }"
                @blur="handleFieldTouch('birthDate')"
                @input="
                  state.validation.birthDate.touched &&
                    validateField('birthDate', state.form.birthDate)
                "
              />
              <div
                v-if="
                  state.validation.birthDate.touched &&
                  state.validation.birthDate.message
                "
                :class="[
                  'field-message',
                  state.validation.birthDate.isValid
                    ? 'field-success'
                    : 'field-error',
                ]"
              >
                {{ state.validation.birthDate.message }}
              </div>
              <div
                v-else-if="
                  state.validation.birthDate.touched &&
                  state.validation.birthDate.isValid &&
                  state.form.birthDate
                "
              >
                올바른 날짜 형식입니다.
              </div>
            </div>
            <!-- <v-select
              id="genderDetail"
              v-model="gender"
              :hint="`${gender.abbr}`"
              :items="genders"
              item-title="state"
              item-value="abbr"
              
              density="compact"
              variant="underlined"
              persistent-hint
              return-object
              single-line
              :class="
                (['w-25', 'h-25', 'ma-0'],
                {
                  error:
                    state.validation.gender.touched &&
                    !state.validation.gender.isValid,
                  success:
                    state.validation.gender.touched &&
                    state.validation.gender.isValid &&
                    state.form.gender,
                })
              "
              @blur="handleFieldTouch('gender')"
              @input="
                state.validation.gender.touched &&
                  validateField('gender', gender.title)
              "
            ></v-select>
            <div
              v-if="
                state.validation.gender.touched &&
                state.validation.gender.message
              "
              :class="[
                'field-message',
                state.validation.gender.isValid
                  ? 'field-success'
                  : 'field-error',
              ]"
            >
              {{ state.validation.gender.message }}
            </div>
            <div
              v-else-if="
                state.validation.gender.touched &&
                state.validation.gender.isValid &&
                state.form.gender
              "
            >
              성별 선택 완료.
            </div> -->
          </div>
          <!-- 여기 어디 넣어보자  -->
          <!-- <div class="form-group">
            <label for="gender">성별 *</label>
            <input
              type="text"
              id="gender"
              placeholder="남/여"
              maxlength="8"
              v-model="state.form.gender"
              :class="{
                error:
                  state.validation.gender.touched &&
                  !state.validation.gender.isValid,
                success:
                  state.validation.gender.touched &&
                  state.validation.gender.isValid &&
                  state.form.gender,
              }"
              @blur="handleFieldTouch('gender')"
              @input="
                state.validation.gender.touched &&
                  validateField('gender', state.form.gender)
              "
            />
            <div
              v-if="
                state.validation.gender.touched &&
                state.validation.gender.message
              "
              :class="[
                'field-message',
                state.validation.gender.isValid
                  ? 'field-success'
                  : 'field-error',
              ]"
            >
              {{ state.validation.gender.message }}
            </div>
            <div
              v-else-if="
                state.validation.gender.touched &&
                state.validation.gender.isValid &&
                state.form.gender
              "
              class="field-success"
            >
              올바른 성별 형식입니다.
            </div>
          </div> -->
          <div class="form-group"></div>
          <!-- 수정 -->
          <div class="form-group">
            <label for="memberNick">닉네임 *</label>
            <div class="input-wrapper">
              <input
                type="text"
                id="memberNick"
                placeholder="닉네임을 입력해 주세요(한글, 영문, 숫자, _만 사용 가능)"
                v-model="state.form.memberNick"
                :class="{
                  error:
                    state.validation.memberNick.touched &&
                    !state.validation.memberNick.isValid,
                  success:
                    state.validation.memberNick.touched &&
                    state.validation.memberNick.isValid &&
                    state.validation.memberNick.available,
                }"
                @blur="handleFieldTouch('memberNick')"
                @input="
                  state.validation.memberNick.touched &&
                    validateField('memberNick', state.form.memberNick)
                "
              />
              <button
                type="button"
                class="btn-small"
                @click="checkDuplicateNickname"
                :disabled="state.loading"
              >
                <span v-if="state.loading">확인중...</span>
                <span v-else>중복확인</span>
              </button>
            </div>
            <div
              v-if="
                state.validation.memberNick.touched &&
                state.validation.memberNick.message
              "
              :class="[
                'field-message',
                state.validation.memberNick.isValid &&
                state.validation.memberNick.available
                  ? 'field-success'
                  : 'field-error',
              ]"
            >
              {{ state.validation.memberNick.message }}
            </div>
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

        <button
          type="submit"
          class="btn-submit"
          :disabled="state.saving || !isFormValid()"
        >
          <span v-if="state.saving">가입 처리중...</span>
          <span v-else>회원가입</span>
        </button>

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
  text-align: center;
}

.error-message,
.success-message {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.success-message {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.message-icon {
  margin-right: 8px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 18px;
}
/* 허찬 수정 부분 */

/* .gender {
  display: flex;
  flex-direction: row;
  
}


.brithDateValide {
  display: flex;
  flex-direction: column;
}

.joininput .v-select {
  width: 15%;
  padding: 12px 14px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background-color: white;
  margin-left: 3px;
} */
/* 허찬 수정 부분 */

.join-form label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.joininput input
{
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background-color: white;
}

.joininput input:focus,
.joininput .v-field__input {
  border-color: #2a9df4;
  box-shadow: 0 0 0 3px rgba(42, 157, 244, 0.1);
}

.joininput input.error,
.joininput .v-field__input {
  border-color: #dc2626;
  background-color: #fef2f2;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.joininput input.success,
.joininput .v-field__input {
  border-color: #16a34a;
  background-color: #f0fdf4;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.joininput input:focus.error .joininput .v-field__input {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
}

.joininput input:focus.success .joininput .v-field__input {
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
}

.field-message,
.v-field__input {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.field-error,
.v-field__input {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.field-success,
.v-field__input {
  color: #16a34a;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.input-wrapper {
  display: flex;
  gap: 8px;
}

.password-match-message {
  font-weight: 500;
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 80px;
}

.btn-small:hover:not(:disabled) {
  background: #333;
}

.btn-small:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #999;
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
  margin-top: 20px;
}

.btn-submit:hover:not(:disabled) {
  background: #1c7fd1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 157, 244, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #ccc;
  transform: none;
  box-shadow: none;
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
</style>
