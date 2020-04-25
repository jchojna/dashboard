import countryCodes from "./countryCodes";
import {statsFields, months} from "./dataHelpers";

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

const getDateIds = (array, isYearly) => {
  const allDaysAsDates = array.map(([elem]) => elem);
  const daysAsDates = [...new Set(allDaysAsDates)];
  const allMonthsAsDates = daysAsDates.map((date) =>
    date.split("-").slice(0, 2).join("-")
  );
  const monthsAsDates = [...new Set(allMonthsAsDates)];
  return isYearly ? monthsAsDates : daysAsDates;
};

const getSpecificData = (data, field, month, year, isAllBefore = false) => {
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  const histArray = [];
  /* HIST DATA */
  Object.values(data).forEach((datesObj) => {
    histArray.push(...Object.entries(datesObj));
  });
  // get filtered and sorted array of all date-value elements
  // in a given time range (if there's more than one country
  // there will be many duplicates of the same date key)
  const filteredHistArray = histArray
    .filter(([date]) => {
      const [y, m] = date.split("-").map((elem) => parseInt(elem));

      if (isAllBefore) {
        return y < yearNum || (y === yearNum && m < monthNum);
      } else {
        return monthNum === 0 ? y === yearNum : m === monthNum && y === yearNum;
      }
    })
    .sort(([dateA], [dateB]) => {
      const getNum = (date) => parseInt(date.split("-").join(""));
      return getNum(dateA) - getNum(dateB);
    });

  // get date keys in format yyyy-mm-dd for days
  // or yyyy-mm for months
  const isYearly = monthNum === 0;
  const dateStrings = getDateIds(filteredHistArray, isYearly);

  const histData = dateStrings.map((dateString, index) => {
    const value = filteredHistArray
      .filter(([date]) => date.includes(dateString))
      .map(([date, values]) => values[field])
      .reduce((a, b) => a + b, 0);

    return {
      id: `${index + 1} ${months[month]}`,
      [field]: value,
    };
  });
  return histData;
};

export const getAnalyticsData = (data, field, month, year) => {
  const mapData = {};
  const countriesTotals = {};
  const [r, g, b] = getColor(field);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  Object.entries(data).forEach(([countryName, values]) => {
    countriesTotals[countryName] = Object.entries(values)
      .filter(([date]) => {
        //* refactor
        const [y, m] = date.split("-").map((elem) => parseInt(elem));
        return monthNum === 0 ? y === yearNum : m === monthNum && y === yearNum;
      })
      .map(([date, values]) => values[field])
      .reduce((acc, curr) => acc + curr, 0);
  });

  const totalsArray = Object.values(countriesTotals);
  const maxTotal = Math.max(...totalsArray);
  const allCountriesTotal = totalsArray.reduce((a, b) => a + b, 0);

  /* MAP DATA */
  Object.keys(data).forEach((countryName) => {
    const countryCode = countryCodes[countryName];
    if (countryCode) {
      const countryTotal = countriesTotals[countryName];
      const countryPercent = ((countryTotal / allCountriesTotal) * 100)
        .toFixed(1)
        .concat("%");
      const minOpacity = 0.1;
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

  /* HISTOGRAM DATA */
  const histData = getSpecificData(data, field, month, year);
  return [mapData, histData];
};

/* SUMMARY DATA */
export const getSummaryData = (data, month, year) => {
  const getFieldTotals = () => {

    const array = [];
    for (let field in statsFields) {
      const beforeTotal = getTotal(field, true);
      const currentTotal = getTotal(field, false);
      const allTotal = beforeTotal + currentTotal;
      const beforePercent = beforeTotal / allTotal * 100;
      const currentPercent =  currentTotal / allTotal * 100;

      array.push({
        id: field,
        "all before": beforePercent,
        "current period": currentPercent,
      });
    }
    return array;
  };

  const getTotal = (field, isAllBefore) => {
    return getSpecificData(data, field, month, year, isAllBefore)
      .map((elem) => elem[field])
      .reduce((a, b) => a + b, 0);
  };

  return getFieldTotals();
};
