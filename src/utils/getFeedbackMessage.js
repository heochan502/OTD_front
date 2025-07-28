import feedbackMessages from "@/api/health/feedbackMessageForExercise.json";

export function getFeedbackMessage({
  todayDuration,
  yesterdayDuration,
  todayEffort,
  yesterdayEffort,
  todayKcal,
  isFirst,
  isComeback,
}) {
  if (isFirst) return find("firstWorkout");
  if (isComeback) return find("comeback");

  if (todayDuration > yesterdayDuration + 10) return find("muchMoreDuration");
  if (todayDuration > yesterdayDuration) return find("moreDuration");
  if (todayDuration < yesterdayDuration) return find("lessDuration");

  if (todayEffort > yesterdayEffort) return find("moreEffort");
  if (todayEffort < yesterdayEffort) return find("lessEffort");

  if (todayEffort < 2 && todayDuration < 10) return find("restDay");

  if (todayKcal > 300) return find("highCalories");
  if (todayKcal < 100) return find("lowCalories");

  return find("equalDuration");
}

function find(id) {
  const item = feedbackMessages.find((msg) => msg.id === id);
  return item?.message || "잘하고 있어요!";
}
