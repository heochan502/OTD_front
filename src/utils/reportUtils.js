// 오늘 날짜
export function getDateString(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000; // 분 → ms
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().split("T")[0];
}
// 어제날짜
export function getYesterdayDateString(date = new Date()) {
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

// 운동 리포트 관련 함수
export function filterExerciseLogsByDate(logs, dateStr) {
  return logs.filter((log) => log.exerciseDatetime.startsWith(dateStr));
}

export function calcKcal(logs) {
  return logs.reduce((sum, log) => sum + (log.exerciseKcal || 0), 0);
}

export function calcDuration(logs) {
  return logs.reduce((sum, log) => sum + (log.exerciseDuration || 0), 0);
}

export function calcEffortAvg(logs) {
  const sum = logs.reduce((acc, log) => acc + (log.effortLevel || 0), 0);
  return Math.round(sum / (logs.length || 1));
}

//  건강 리포트 관련 함수
export function filterHealthLogsByDate(logs, dateStr) {
  return logs.filter((log) => log.healthlogDatetime.startsWith(dateStr));
}

// 날짜 포맷 함수 'YYYY년 MM월 DD일'
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 날짜 포맷 함수 'YYYY-MM-DD'
export const formatDate2 = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
