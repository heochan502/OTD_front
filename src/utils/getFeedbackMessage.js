import feedbackMessages from "@/api/health/feedbackMessageForExercise.json";

export function getFeedbackMessage({
  todayDuration,
  yesterdayDuration,
  todayEffort,
  yesterdayEffort,
  todayKcal,
  yesterdayKcal,
  isFirst,
  isComeback,
  hasRecord = true,
}) {
  if (!hasRecord) return find("noRecord");
  if (isFirst) return find("firstWorkout");
  if (isComeback) return find("comeback");

  // 휴식 조건
  if (todayEffort < 2 && todayDuration < 10) return find("restDay");

  // 활동 에너지 비교 (칼로리 기반)
  if (todayKcal > 300) return find("highCalories");
  if (todayKcal < 100) return find("lowCalories");
  if (todayKcal > yesterdayKcal) return find("moreCaloriesThanYesterday");
  if (todayKcal < yesterdayKcal) return find("lessCaloriesThanYesterday");
  if (todayKcal === yesterdayKcal) return find("equalCalories");

  // 운동 시간 비교
  if (todayDuration > yesterdayDuration + 10) return find("muchMoreDuration");
  if (todayDuration > yesterdayDuration) return find("moreDuration");
  if (todayDuration < yesterdayDuration) return find("lessDuration");
  if (todayDuration === yesterdayDuration) return find("equalDuration");

  // 운동 강도 비교
  if (todayEffort > yesterdayEffort) return find("moreEffort");
  if (todayEffort < yesterdayEffort) return find("lessEffort");
  if (todayEffort === yesterdayEffort) return find("equalEffort");

  return "잘하고 있어요!";
}

// id에 해당하는 메시지 반환
function find(id) {
  const item = feedbackMessages.find((msg) => msg.id === id);
  return item?.message || "잘하고 있어요!";
}
