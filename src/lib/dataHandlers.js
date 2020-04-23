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
  const offsets = {
    today: [0, 0, 1, 0],
    yesterday: [1, 0, 1, 0],
    week: [1, 6, 1, 6],
    month: [1, 27, 1, 27],
    year: [1, 364, 1, 364],
  };

  return Object.entries(offsets)
    .find(([key, value]) => key === range)[1]
    .map((offset) =>
      getDateString(new Date(now.setDate(now.getDate() - offset)))
    );
};

export const getTotalInTimeRange = (data, type, breakpointDates) => {
  let lastPeriodTotal = 0;
  let prevPeriodTotal = 0;

  const [
    lastPeriodEndDate,
    lastPeriodStartDate,
    prevPeriodEndDate,
    prevPeriodStartDate,
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

  const percentage = (lastPeriodTotal / prevPeriodTotal - 1).toFixed(1);
  return [lastPeriodTotal, percentage];
};
