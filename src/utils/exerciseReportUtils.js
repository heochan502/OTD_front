export function getDateString(date = new Date()) {
  return date.toISOString().split("T")[0];
}

export function getYesterdayDateString(date = new Date()) {
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

export function filterLogsByDate(logs, dateStr) {
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
