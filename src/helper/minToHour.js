export const minToHour = minutes => {
  return Math.round((minutes / 60) * 10) / 10 + "hr";
};
