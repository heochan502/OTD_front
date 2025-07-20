<script setup>
const today = new Date();
const thisYear = today.getFullYear();
const thisMonth = ("0" + (today.getMonth() + 1)).slice(-2);
const thisDay = ("0" + today.getDate()).slice(-2);
</script>

<template>
  <div>
    <h2>리마인더 추가하기</h2>
    <div>
      <div>
        <span title="취소"></span>
      </div>
      <div>
        <input type="date" />
      </div>
      <div>
        <img src="/src/image/alarm_off.png" alt="알람비허용" />
        <span class="toggle">
          <input type="checkbox" id="toggle-slider" />
          <label for="toggle-slider">On/Off</label>
        </span>
      </div>
      <div>
        <!-- 월화수목금토일 -->
      </div>
      <div>
        <input type="text" placeholder="어떤 일정이 있으신가요?" />
      </div>
      <div>
        <textarea
          name="내용"
          id="content"
          placeholder="내용을 추가해주세요!"
        ></textarea>
      </div>
      <button>저장하기</button>
    </div>
  </div>
</template>

<style scoped>
label {
  cursor: pointer;
  text-indent: -9999px;
  width: 100px;
  height: 50px;
  background-color: #dff7fa;
  border-radius: 25px;
  display: inline-block;
  position: relative;
  transition: 0.4s;
}
label::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 4px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #a5cace;
  transition: 0.4s;
}
#toggle-slider:checked + label {
  background: #96e7ef;
}
#toggle-slider:checked + label::after {
  left: 54px;
  background: #1d6369;
}
#toggle-slider {
  display: none;
}
</style>
