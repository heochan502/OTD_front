<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile, updateProfile, checkEmail, checkNickname } from '@/services/accountService'
import { useAccountStore } from '@/stores/counter'

const router = useRouter()
const counter = useAccountStore()
const photoInput = ref(null)

const state = reactive({
  form: {
    memberNoLogin: 0,
    memberId: '',
    email: '',
    name: '',
    birthDate: '',
    memberNick: '',
    profileImg: ''
  },
  originalForm: {},
  loading: true,
  saving: false,
  showSuccess: false,
  validation: {
    name: {
      isValid: true,
      message: '',
      touched: false
    },
    email: {
      isValid: true,
      message: '',
      touched: false,
      checking: false
    },
    memberNick: {
      isValid: true,
      message: '',
      touched: false,
      checking: false
    },
    birthDate: {
      isValid: true,
      message: '',
      touched: false
    }
  },
  generalError: ''
})

const formatDateForInput = (birthDate) => {
  if (!birthDate || birthDate.length !== 8) return birthDate
  return `${birthDate.slice(0, 4)}-${birthDate.slice(4, 6)}-${birthDate.substring(6, 8)}`
}

const formatDateForSave = (dateString) => {
  if (!dateString) return ''
  return dateString.replace(/-/g, '')
}

const handleImgError = () => {
  state.form.profileImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjIwIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA5NUMyMCA4MCA0MCA2NyA2MCA2N0M4MCA2NyAxMDAgODAgMTAwIDk1IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
}

const changeProfilePhoto = () => {
  photoInput.value?.click()
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    state.generalError = '이미지 파일 크기는 5MB 이하로 업로드해주세요.'
    setTimeout(() => (state.generalError = ''), 3000)
    return
  }

  if (!file.type.startsWith('image/')) {
    state.generalError = '이미지 파일만 업로드 가능합니다.'
    setTimeout(() => (state.generalError = ''), 3000)
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    state.form.profileImg = e.target.result
  }
  reader.onerror = () => {
    state.generalError = '이미지 파일을 읽는 중 오류가 발생했습니다.'
    setTimeout(() => (state.generalError = ''), 3000)
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleBirthDateInput = (event) => {
  let value = event.target.value.replace(/[^0-9]/g, '')
  
  if (value.length > 8) {
    value = value.slice(0, 8)
  }
  
  if (value.length >= 5) {
    value = value.slice(0, 4) + '-' + value.slice(4)
  }
  if (value.length >= 8) {
    value = value.slice(0, 7) + '-' + value.slice(7)
  }
  
  state.form.birthDate = value
  
  if (state.validation.birthDate.touched) {
    validateField('birthDate', value)
  }
}

const checkEmailDuplication = async (email) => {
  if (!email || email === state.originalForm.email) {
    console.log('이메일 중복 확인 생략:', email, '원본:', state.originalForm.email)
    return { isValid: true, message: '' }
  }

  try {
    state.validation.email.checking = true
    console.log('이메일 중복 확인 API 호출:', `/user/check/email/${email}`)
    
    const response = await checkEmail(email)
    console.log('이메일 API 전체 응답:', response)
    console.log('응답 상태:', response?.status)
    console.log('응답 데이터:', response?.data)
    
    if (response && response.status === 200) {
      const data = response.data
      
      // 서버에서 다양한 형식으로 응답할 수 있으므로 모든 경우를 확인
      console.log('데이터 타입:', typeof data)
      console.log('데이터 내용:', data)
      
      let isDuplicate = false
      
      // 가능한 응답 형식들
      if (typeof data === 'boolean') {
        isDuplicate = data // true면 중복, false면 사용가능
      } else if (typeof data === 'object' && data !== null) {
        isDuplicate = data.isDuplicate || 
                      data.exists || 
                      data.duplicate || 
                      data.isExist ||
                      data.available === false || // available이 false면 중복
                      false
      } else if (typeof data === 'string') {
        isDuplicate = data === 'true' || data === 'duplicate' || data === 'exists'
      }
      
      console.log('최종 중복 판정:', isDuplicate)
      
      if (isDuplicate) {
        return { isValid: false, message: '이미 사용 중인 이메일입니다.' }
      } else {
        return { isValid: true, message: '사용 가능한 이메일입니다.' }
      }
    } else if (response && response.status === 404) {
      // 404는 보통 "존재하지 않음" = "사용 가능"을 의미할 수 있음
      console.log('404 응답 - 사용 가능으로 처리')
      return { isValid: true, message: '사용 가능한 이메일입니다.' }
    } else {
      console.error('이메일 API 응답 오류 - 상태코드:', response?.status)
      console.error('오류 데이터:', response?.data)
      return { isValid: false, message: `이메일 중복 확인 중 오류가 발생했습니다. (${response?.status})` }
    }
  } catch (error) {
    console.error('이메일 중복 확인 에러:', error)
    console.error('에러 상세:', error.response)
    
    // 네트워크 오류나 서버 오류 시에는 일단 진행 가능하도록 처리
    if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
      return { isValid: true, message: '중복 확인 서버에 연결할 수 없습니다. 임시로 진행합니다.' }
    }
    
    return { isValid: false, message: '이메일 중복 확인 중 오류가 발생했습니다.' }
  } finally {
    state.validation.email.checking = false
  }
}

const checkNicknameDuplication = async (nickname) => {
  if (!nickname || nickname === state.originalForm.memberNick) {
    console.log('닉네임 중복 확인 생략:', nickname, '원본:', state.originalForm.memberNick)
    return { isValid: true, message: '' }
  }

  try {
    state.validation.memberNick.checking = true
    console.log('닉네임 중복 확인 API 호출:', `/user/check/nickname/${nickname}`)
    
    const response = await checkNickname(nickname)
    console.log('닉네임 API 전체 응답:', response)
    console.log('응답 상태:', response?.status)
    console.log('응답 데이터:', response?.data)
    
    if (response && response.status === 200) {
      const data = response.data
      
      // 서버에서 다양한 형식으로 응답할 수 있으므로 모든 경우를 확인
      console.log('데이터 타입:', typeof data)
      console.log('데이터 내용:', data)
      
      let isDuplicate = false
      
      // 가능한 응답 형식들
      if (typeof data === 'boolean') {
        isDuplicate = data // true면 중복, false면 사용가능
      } else if (typeof data === 'object' && data !== null) {
        isDuplicate = data.isDuplicate || 
                      data.exists || 
                      data.duplicate || 
                      data.isExist ||
                      data.available === false || // available이 false면 중복
                      false
      } else if (typeof data === 'string') {
        isDuplicate = data === 'true' || data === 'duplicate' || data === 'exists'
      }
      
      console.log('최종 중복 판정:', isDuplicate)
      
      if (isDuplicate) {
        return { isValid: false, message: '이미 사용 중인 닉네임입니다.' }
      } else {
        return { isValid: true, message: '사용 가능한 닉네임입니다.' }
      }
    } else if (response && response.status === 404) {
      // 404는 보통 "존재하지 않음" = "사용 가능"을 의미할 수 있음
      console.log('404 응답 - 사용 가능으로 처리')
      return { isValid: true, message: '사용 가능한 닉네임입니다.' }
    } else {
      console.error('닉네임 API 응답 오류 - 상태코드:', response?.status)
      console.error('오류 데이터:', response?.data)
      return { isValid: false, message: `닉네임 중복 확인 중 오류가 발생했습니다. (${response?.status})` }
    }
  } catch (error) {
    console.error('닉네임 중복 확인 에러:', error)
    console.error('에러 상세:', error.response)
    
    // 네트워크 오류나 서버 오류 시에는 일단 진행 가능하도록 처리
    if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
      return { isValid: true, message: '중복 확인 서버에 연결할 수 없습니다. 임시로 진행합니다.' }
    }
    
    return { isValid: false, message: '닉네임 중복 확인 중 오류가 발생했습니다.' }
  } finally {
    state.validation.memberNick.checking = false
  }
}

const validateName = (name) => {
  if (!name.trim()) {
    return { isValid: false, message: '이름을 입력해주세요.' }
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: '이름은 최소 2글자 이상이어야 합니다.' }
  }
  if (name.trim().length > 20) {
    return { isValid: false, message: '이름은 최대 20글자까지 입력 가능합니다.' }
  }
  const nameRegex = /^[가-힣a-zA-Z\s]+$/
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, message: '이름은 한글 또는 영문만 입력 가능합니다.' }
  }
  return { isValid: true, message: '' }
}

const validateEmail = async (email) => {
  if (!email.trim()) {
    return { isValid: false, message: '이메일을 입력해주세요.' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' }
  }
  if (email.length > 50) {
    return { isValid: false, message: '이메일은 최대 50자까지 입력 가능합니다.' }
  }
  
  const duplicateResult = await checkEmailDuplication(email)
  return duplicateResult
}

const validateNickname = async (nickname) => {
  if (nickname && nickname.trim()) {
    if (nickname.trim().length < 2) {
      return { isValid: false, message: '닉네임은 최소 2글자 이상이어야 합니다.' }
    }
    if (nickname.trim().length > 15) {
      return { isValid: false, message: '닉네임은 최대 15글자까지 입력 가능합니다.' }
    }
    const nicknameRegex = /^[가-힣a-zA-Z0-9_]+$/
    if (!nicknameRegex.test(nickname.trim())) {
      return { isValid: false, message: '닉네임은 한글, 영문, 숫자, 언더스코어(_)만 사용 가능합니다.' }
    }
    
    const duplicateResult = await checkNicknameDuplication(nickname.trim())
    return duplicateResult
  }
  return { isValid: true, message: '' }
}

const validateBirthDate = (birthDate) => {
  if (birthDate && birthDate.trim()) {
    const cleanDate = birthDate.replace(/-/g, '')
    const dateRegex = /^\d{8}$/
    
    if (!dateRegex.test(cleanDate)) {
      return { isValid: false, message: 'YYYYMMDD 형식으로 8자리 숫자를 입력해주세요.' }
    }

    const year = parseInt(cleanDate.substring(0, 4))
    const month = parseInt(cleanDate.substring(4, 6))
    const day = parseInt(cleanDate.substring(6, 8))
    const currentYear = new Date().getFullYear()

    if (year < 1900 || year > currentYear) {
      return { isValid: false, message: '올바른 연도를 입력해주세요.' }
    }
    if (month < 1 || month > 12) {
      return { isValid: false, message: '올바른 월을 입력해주세요.' }
    }
    if (day < 1 || day > 31) {
      return { isValid: false, message: '올바른 일을 입력해주세요.' }
    }

    const testDate = new Date(year, month - 1, day)
    if (testDate.getFullYear() !== year || testDate.getMonth() !== month - 1 || testDate.getDate() !== day) {
      return { isValid: false, message: '존재하지 않는 날짜입니다.' }
    }

    if (testDate > new Date()) {
      return { isValid: false, message: '미래 날짜는 입력할 수 없습니다.' }
    }
  }
  return { isValid: true, message: '' }
}

const validateField = async (field, value) => {
  let result

  switch (field) {
    case 'name':
      result = validateName(value)
      break
    case 'email':
      result = await validateEmail(value)
      break
    case 'memberNick':
      result = await validateNickname(value)
      break
    case 'birthDate':
      result = validateBirthDate(value)
      break
    default:
      result = { isValid: true, message: '' }
  }

  state.validation[field] = {
    ...state.validation[field],
    isValid: result.isValid,
    message: result.message
  }
}

const handleFieldTouch = (field) => {
  state.validation[field].touched = true
  validateField(field, state.form[field])
}

const isFormValid = () => {
  const validationResult = Object.values(state.validation).every((field) => field.isValid)
  console.log('폼 유효성 검사:', {
    validation: state.validation,
    result: validationResult,
    emailChecking: state.validation.email.checking,
    nicknameChecking: state.validation.memberNick.checking
  })
  return validationResult
}

let emailTimeout
let nicknameTimeout

watch(() => state.form.name, (newValue) => {
  if (state.validation.name.touched) {
    validateField('name', newValue)
  }
})

watch(() => state.form.email, (newValue) => {
  if (state.validation.email.touched) {
    clearTimeout(emailTimeout)
    emailTimeout = setTimeout(() => {
      validateField('email', newValue)
    }, 500)
  }
})

watch(() => state.form.memberNick, (newValue) => {
  if (state.validation.memberNick.touched) {
    clearTimeout(nicknameTimeout)
    nicknameTimeout = setTimeout(() => {
      validateField('memberNick', newValue)
    }, 500)
  }
})

watch(() => state.form.birthDate, (newValue) => {
  if (state.validation.birthDate.touched) {
    validateField('birthDate', newValue)
  }
})

const saveProfile = async () => {
  console.log('=== 프로필 저장 시작 ===')
  
  // 모든 필드 검증
  for (const field of Object.keys(state.validation)) {
    state.validation[field].touched = true
    await validateField(field, state.form[field])
  }

  console.log('검증 결과:', state.validation)
  console.log('폼 유효성:', isFormValid())

  if (!isFormValid()) {
    state.generalError = '입력 정보를 다시 확인해주세요.'
    setTimeout(() => (state.generalError = ''), 3000)
    console.log('폼 검증 실패')
    return
  }

  state.saving = true
  state.generalError = ''

  try {

    const formData = {
      memberNoLogin: state.form.memberNoLogin,
      memberId: state.form.memberId,
      email: state.form.email?.trim(),
      name: state.form.name?.trim(),
      birthDate: formatDateForSave(state.form.birthDate),
      memberNick: state.form.memberNick?.trim() || null,
      memberImg: state.form.profileImg || null  // 백엔드 필드명에 맞춤: profileImg → memberImg
    }


    Object.keys(formData).forEach(key => {
      if (formData[key] === '' || formData[key] === undefined) {
        if (key === 'memberNick' || key === 'profileImg' || key === 'birthDate') {
          formData[key] = null 
        }
      }
    })

    console.log('원본 폼 데이터:', state.form)
    console.log('전송할 데이터:', formData)
    console.log('JSON 문자열:', JSON.stringify(formData, null, 2))

    const res = await updateProfile(formData)
    
    console.log('프로필 업데이트 응답:', res)
    console.log('응답 상태:', res?.status)
    console.log('응답 데이터:', res?.data)

    if (res && res.status === 200) {
      state.showSuccess = true
      state.originalForm = { ...state.form }
      console.log('프로필 업데이트 성공')
      setTimeout(() => { state.showSuccess = false }, 3000)
    } else {
      console.error('프로필 업데이트 실패 - 상태코드:', res?.status)
      console.error('오류 응답:', res?.data)
      
      let errorMessage = '정보 수정에 실패했습니다.'
      
      if (res?.data?.message) {
        errorMessage = res.data.message
      } else if (res?.data?.error) {
        errorMessage = res.data.error
      } else if (res?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 서버 로그를 확인해주세요.'
      } else if (res?.status) {
        errorMessage = `정보 수정에 실패했습니다. 상태코드: ${res.status}`
      }
      
      state.generalError = errorMessage
    }
  } catch (error) {
    console.error('프로필 업데이트 에러:', error)
    console.error('에러 상세:', error.response)
    
    let errorMessage = '오류가 발생했습니다: ' + error.message
    

    if (error.code === 'ERR_NETWORK') {
      errorMessage = '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.'
    } else if (error.response) {

      console.error('서버 오류 응답:', error.response.data)
      
      if (error.response.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response.status === 401) {
        errorMessage = '로그인이 필요합니다.'

      } else if (error.response.status === 403) {
        errorMessage = '권한이 없습니다.'
      } else if (error.response.status === 422) {
        errorMessage = '입력 데이터가 올바르지 않습니다.'
      } else if (error.response.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.'
      }
    }
    
    state.generalError = errorMessage
  } finally {
    state.saving = false
    console.log('=== 프로필 저장 완료 ===')
  }
}

onMounted(async () => {
  if (!counter.state.loggedIn) {
    router.push('/login')
    return
  }

  try {
    const res = await getProfile()
    if (res && res.status === 200) {
      const profileData = {
        ...res.data,
        birthDate: formatDateForInput(res.data.birthDate)
      }
      Object.assign(state.form, profileData)
      state.originalForm = { ...profileData }
    } else {
      state.generalError = '프로필 정보를 불러오는데 실패했습니다.'
    }
  } catch (error) {
    state.generalError = '프로필 정보를 불러오는 중 오류가 발생했습니다.'
  } finally {
    state.loading = false
  }
})

watch(() => counter.state.loggedIn, (isLoggedIn) => {
  if (!isLoggedIn) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="content-container">
        <div v-if="state.loading" class="loading-wrapper">
          <div class="loading-spinner"></div>
          <p>정보를 불러오는 중...</p>
        </div>

        <div v-else class="edit-content">
          <div v-if="state.showSuccess" class="success-message">
            <div class="message-icon">✓</div>
            <div>정보가 성공적으로 업데이트되었습니다!</div>
          </div>

          <div v-if="state.generalError" class="error-message">
            <div class="message-icon">⚠</div>
            <div>{{ state.generalError }}</div>
          </div>

          <form @submit.prevent="saveProfile">
            <div class="section">
              <div class="header">
                <h1>회원정보 수정</h1>
              </div>
              
              <div class="profile-photo-section">
                <div class="photo-wrapper" @click="changeProfilePhoto">
                  <img
                    :src="state.form.profileImg || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjIwIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA5NUMyMCA4MCA0MCA2NyA2MCA2N0M4MCA2NyAxMDAgODAgMTAwIDk1IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='"
                    alt="프로필 사진"
                    class="profile-img"
                    @error="handleImgError"
                  />
                  <div class="photo-overlay">
                    <span>사진 변경</span>
                  </div>
                </div>
                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  @change="handlePhotoChange"
                  style="display: none;"
                />
                <div class="photo-info">
                  <p>클릭하여 프로필 사진을 변경하세요</p>
                  <p class="photo-hint">JPG, PNG, GIF 파일 (최대 5MB)</p>
                </div>
              </div>
              
              <h3 class="section-title">기본 정보</h3>

              <div class="form-row">
                <div class="form-group">
                  <label for="memberId">아이디</label>
                  <input
                    type="text"
                    id="memberId"
                    :value="state.form.memberId"
                    readonly
                    class="readonly"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    v-model="state.form.email"
                    required
                    placeholder="이메일을 입력하세요"
                    :class="{
                      error: state.validation.email.touched && !state.validation.email.isValid,
                      success: state.validation.email.touched && state.validation.email.isValid && state.form.email,
                    }"
                    @blur="handleFieldTouch('email')"
                  />
                  <div v-if="state.validation.email.checking" class="field-checking">
                    이메일 중복을 확인하는 중...
                  </div>
                  <div
                    v-else-if="state.validation.email.touched && state.validation.email.message"
                    :class="{
                      'field-error': !state.validation.email.isValid,
                      'field-success': state.validation.email.isValid
                    }"
                  >
                    {{ state.validation.email.message }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="name">이름</label>
                  <input
                    type="text"
                    id="name"
                    v-model="state.form.name"
                    required
                    placeholder="이름을 입력하세요"
                    :class="{
                      error: state.validation.name.touched && !state.validation.name.isValid,
                      success: state.validation.name.touched && state.validation.name.isValid && state.form.name,
                    }"
                    @blur="handleFieldTouch('name')"
                  />
                  <div
                    v-if="state.validation.name.touched && state.validation.name.message"
                    class="field-error"
                  >
                    {{ state.validation.name.message }}
                  </div>
                  <div
                    v-else-if="state.validation.name.touched && state.validation.name.isValid && state.form.name"
                    class="field-success"
                  >
                    올바른 이름입니다.
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="memberNick">닉네임</label>
                  <input
                    type="text"
                    id="memberNick"
                    v-model="state.form.memberNick"
                    placeholder="닉네임을 입력하세요"
                    :class="{
                      error: state.validation.memberNick.touched && !state.validation.memberNick.isValid,
                      success: state.validation.memberNick.touched && state.validation.memberNick.isValid && state.form.memberNick,
                    }"
                    @blur="handleFieldTouch('memberNick')"
                  />
                  <div v-if="state.validation.memberNick.checking" class="field-checking">
                    닉네임 중복을 확인하는 중...
                  </div>
                  <div
                    v-else-if="state.validation.memberNick.touched && state.validation.memberNick.message"
                    :class="{
                      'field-error': !state.validation.memberNick.isValid,
                      'field-success': state.validation.memberNick.isValid
                    }"
                  >
                    {{ state.validation.memberNick.message }}
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="birthDate">생년월일</label>
                  <input
                    type="text"
                    id="birthDate"
                    :value="state.form.birthDate"
                    placeholder="YYYYMMDD (8자리 숫자)"
                    maxlength="10"
                    :class="{
                      error: state.validation.birthDate.touched && !state.validation.birthDate.isValid,
                      success: state.validation.birthDate.touched && state.validation.birthDate.isValid && state.form.birthDate,
                    }"
                    @blur="handleFieldTouch('birthDate')"
                    @input="handleBirthDateInput"
                  />
                  <div
                    v-if="state.validation.birthDate.touched && state.validation.birthDate.message"
                    class="field-error"
                  >
                    {{ state.validation.birthDate.message }}
                  </div>
                  <div
                    v-else-if="state.validation.birthDate.touched && state.validation.birthDate.isValid && state.form.birthDate"
                    class="field-success"
                  >
                    올바른 날짜 형식입니다.
                  </div>
                </div>
              </div>
            </div>

            <div class="button-group">
              <router-link to="/profile" class="btn btn-outline">
                취소
              </router-link>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="state.saving || !isFormValid() || state.validation.email.checking || state.validation.memberNick.checking"
                @click="console.log('저장 버튼 클릭', { saving: state.saving, formValid: isFormValid(), emailChecking: state.validation.email.checking, nicknameChecking: state.validation.memberNick.checking })"
              >
                <span v-if="state.saving">저장 중...</span>
                <span v-else>저장하기</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.field-error {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.field-success {
  color: #16a34a;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.field-checking {
  color: #3b82f6;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.form-group input.error {
  border-color: #dc2626;
  background-color: #fef2f2;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-group input.success {
  border-color: #16a34a;
  background-color: #f0fdf4;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-group input:focus.error {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
}

.form-group input:focus.success {
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
}

.page-wrapper {
  min-height: 100vh;
  background-color: #f8fafc;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #1e293b;
  font-size: 28px;
  font-weight: 700;
  margin-top: 5px;
}

.loading-wrapper {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.profile-photo-section {
  text-align: center;
  margin-bottom: 32px;
}

.photo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e2e8f0;
  transition: border-color 0.3s ease;
}

.photo-wrapper:hover {
  border-color: #3b82f6;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.photo-wrapper:hover .photo-overlay {
  opacity: 1;
}

.photo-info {
  margin-top: 12px;
  text-align: center;
}

.photo-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #6b7280;
}

.photo-hint {
  font-size: 12px !important;
  color: #9ca3af !important;
}

.section {
  background: white;
  padding: 47px;
  border-radius: 12px;
  margin-bottom: 23px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.section-title {
  margin-bottom: 20px;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.form-row {
  margin-bottom: 20px;
}

.form-group {
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.readonly {
  background-color: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
}

.form-group input::placeholder {
  color: #9ca3af;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn-outline {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-outline:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: 2px solid #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #e5e7eb;
  color: #9ca3af;
  border-color: #e5e7eb;
}
</style>