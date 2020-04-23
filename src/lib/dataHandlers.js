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

export const getDateString = (date) => date.toISOString().slice(0, 10);

export const getDateFormatted = (date) => {
  return date.toISOString().slice(0, 10);
};

export const getBreakpointDates = (range) => {
  const now = new Date();
  switch (range) {
    case "week":
      return [
        getDateString(new Date(now.setDate(now.getDate() - 1))),
        getDateString(new Date(now.setDate(now.getDate() - 6))),
        getDateString(new Date(now.setDate(now.getDate() - 1))),
        getDateString(new Date(now.setDate(now.getDate() - 6))),
      ];

    case "month":
      return [
        getDateString(new Date(now.setDate(now.getDate() - 1))),
        getDateString(new Date(now.setDate(now.getDate() - 27))),
        getDateString(new Date(now.setDate(now.getDate() - 1))),
        getDateString(new Date(now.setDate(now.getDate() - 27))),
      ];

    case "year":
      return [
        getDateString(new Date(now.setDate(now.getDate() - 1))),
        getDateString(new Date(now.setDate(now.getDate() - 364))),
        getDateString(new Date(now.setDate(now.getDate() - 1))),
        getDateString(new Date(now.setDate(now.getDate() - 364))),
      ];

    default:
      return false;
  }
};

export const getTotalInTimeRange = (data, type, breakpointDates) => {
  let lastPeriodTotal = 0;
  let prevPeriodTotal = 0;

  const [
    lastPeriodEndDate,
    lastPeriodStartDate,
    prevPeriodEndDate,
    prevPeriodStartDate
  ] = breakpointDates;

  /* iterating through all countries */
  Object.values(data).forEach((country) => {
    const prevStartIndex = Object.keys(country).findIndex(
      (key) => key === prevPeriodStartDate
    );
    const prevEndIndex = Object.keys(country).findIndex(
      (key) => key === prevPeriodEndDate
    );
    const lastStartIndex = Object.keys(country).findIndex(
      (key) => key === lastPeriodStartDate
    );
    const lastEndIndex = Object.keys(country).findIndex(
      (key) => key === lastPeriodEndDate
    );

    prevPeriodTotal += Object.values(country)
      .map((date) => date[type])
      .reduce((acc, curr, index) => {
        if (index >= prevStartIndex && index <= prevEndIndex) {
          acc += curr;
        }
        return acc;
      }, 0);
      
    lastPeriodTotal += Object.values(country)
      .map((date) => date[type])
      .reduce((acc, curr, index) => {
        if (index >= lastStartIndex && index <= lastEndIndex) {
          acc += curr;
        }
        return acc;
      }, 0);
  });

  const percentage = (lastPeriodTotal / prevPeriodTotal - 1).toFixed(2);
  return [lastPeriodTotal, percentage];
};
