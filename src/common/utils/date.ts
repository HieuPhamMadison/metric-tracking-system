export const getStartDate = (date: string) => {
  const currentDate = new Date(date);
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    0,
    0,
    0,
  );
};

export const getEndDate = (date: string) => {
  const currentDate = new Date(date);
  const nextDay = new Date(currentDate);
  nextDay.setDate(nextDay.getDate() + 1);
  return new Date(
    nextDay.getFullYear(),
    nextDay.getMonth(),
    nextDay.getDate(),
    0,
    0,
    0,
  );
};
