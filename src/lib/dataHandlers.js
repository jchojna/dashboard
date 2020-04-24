import countryCodes from "./countryCodes";

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

export const getYears = (data) => {
  const currentYear = new Date().getFullYear();
  const years = Object.values(data).map(
    (country) => Object.keys(country)[0].split("-")[0]
  );
  const firstYear = parseInt([...new Set([...years])].sort()[0]);
  const allYears = [];
  for (let i = firstYear; i <= currentYear; i++) {
    allYears.push(i);
  }
  return allYears.sort((a, b) => b - a);
};

const getColor = (id) => {
  const svgIcon = document.querySelector(`svg[class*=${id}]`);
  const style = window.getComputedStyle(svgIcon);
  const color = style.getPropertyValue("background-color");
  return color.match(/\d+/g);
};

const getCountryValue = (dates, field, month, year) => {
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  return Object.entries(dates)
    .filter(([date]) => {
      const [y, m] = date.split("-").map((elem) => parseInt(elem));
      return monthNum === 0 ? y === yearNum : m === monthNum && y === yearNum;
    })
    .map(([date, values]) => values[field])
    .reduce((acc, curr) => acc + curr, 0);
};

export const getMapData = (data, field, month, year) => {
  const [r, g, b] = getColor(field);
  const mapData = {};
  const countriesTotals = {};

  Object.entries(data).forEach(([countryName, values]) => {
    countriesTotals[countryName] = getCountryValue(values, field, month, year);
  });

  const totalsArray = Object.values(countriesTotals);
  const maxTotal = Math.max(...totalsArray);
  const allCountriesTotal = totalsArray.reduce((a, b) => a + b, 0);

  Object.keys(data).forEach((countryName) => {
    const countryCode = countryCodes[countryName];
    if (countryCode) {
      const countryTotal = countriesTotals[countryName];
      const countryPercent = ((countryTotal / allCountriesTotal) * 100)
        .toFixed(1)
        .concat("%");
      const minOpacity = 0.2;
      const opacity = (countryTotal / maxTotal) * (1 - minOpacity) + minOpacity;

      if (countryTotal) {
        mapData[countryCode] = {
          fillColor: `rgba(${r},${g},${b},${opacity})`,
          countryTotal,
          countryPercent,
          field,
        };
      }
    }
  });

  return mapData;
};
