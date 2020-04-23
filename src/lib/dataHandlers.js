export const statsNames = [
  {id: "profit", heading: "Total Profit"},
  {id: "users", heading: "Active users"},
  {id: "orders", heading: "New orders"},
  {id: "complaints", heading: "Open complaints"},
];

export const getRandom = (bottomLimit, upperLimit) => {
  return (
    Math.floor(Math.random() * (upperLimit - bottomLimit + 1)) + bottomLimit
  );
};

export const getStartDateString = (date) => date.toISOString().slice(0, 10);

export const getDateFormatted = (date) => {
  return date.toISOString().slice(0, 10);
};

export const getStartingDates = (date, range) => {
  let lastPeriodStart, prevPeriodStart = null;

  switch (range) {
    case "month":
      lastPeriodStart = new Date(date.setDate(date.getDate() - 28));
      prevPeriodStart = new Date(date.setDate(date.getDate() - 28));
    break;

    default: break;
  }
  console.log('lastPeriodStart', lastPeriodStart);
  console.log('prevPeriodStart', prevPeriodStart);
  return [lastPeriodStart, prevPeriodStart];
}

export const getTotalInTimeRange = (data, type, obj) => {
  let lastPeriodTotal = 0;
  let prevPeriodTotal = 0;
  //const baseTime =
  //  typeof base === "undefined" ? getStartDateString(new Date()) : base;

  Object.values(data).forEach((country) => {
    lastPeriodTotal += Object.values(country)
      .map((date) => date[type])
      .reduce((acc, curr) => acc + curr, 0);
  });

  const percentage = 0;
  return [lastPeriodTotal, percentage];
};
