import countryCodes from "./countryCodes";
import {statsFields, months, days, numberSuffixes} from "./dataHelpers";

export const getRandom = (bottomLimit, upperLimit) => {
  return (
    Math.floor(Math.random() * (upperLimit - bottomLimit + 1)) + bottomLimit
  );
};

export const getDateString = (date) => date.toISOString().slice(0, 10);

const getNumberSuffix = (number) => {
  return number >= 4 ? numberSuffixes[3] : numberSuffixes[number - 1];
};

export const getNumberFormatted = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const getCapitalized = (string) =>
  string
    .split("")
    .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
    .join("");

// get date format to use in stat's header info
export const getTimeRanges = (dates, period) => {
  const [lastEndDate, lastStartDate, prevEndDate, prevStartDate] = dates;

  const getElements = (date) => {
    const [year, month, day] = getDateString(date)
      .split("-")
      .map((string) => parseInt(string));
    const suffix = getNumberSuffix(day);
    const dayName = days[date.getDay()];
    const monthName = getCapitalized(months[month]);
    return [dayName, day, suffix, monthName, year];
  };

  const [
    lastEndDayName,
    lastEndDay,
    lastEndSuffix,
    lastEndMonth,
    lastEndYear,
  ] = getElements(lastEndDate);

  const [
    lastStartDayName,
    lastStartDay,
    lastStartSuffix,
    lastStartMonth,
    lastStartYear,
  ] = getElements(lastStartDate);

  const [
    prevEndDayName,
    prevEndDay,
    prevEndSuffix,
    prevEndMonth,
    prevEndYear,
  ] = getElements(prevEndDate);

  const [
    prevStartDayName,
    prevStartDay,
    prevStartSuffix,
    prevStartMonth,
    prevStartYear,
  ] = getElements(prevStartDate);

  switch (period.toLowerCase()) {
    case "today":
    case "yesterday":
      return `
      ${lastStartDayName}, ${lastStartDay}${lastStartSuffix}
      ${prevStartMonth !== lastStartMonth ? `of ${lastStartMonth}` : ""}
      vs.
      ${prevStartDayName}, ${prevStartDay}${prevStartSuffix} of ${prevStartMonth}
    `;

    case "week":
    case "month":
    case "year":
      return `
      ${lastStartDayName}, ${lastStartDay}${lastStartSuffix}
      ${
        lastStartMonth !== lastEndMonth || lastStartYear !== lastEndYear
          ? `of ${lastStartMonth}`
          : ""
      }
      ${lastStartYear !== lastEndYear ? `, ${lastStartYear}` : ""}

      -

      ${lastEndDayName}, ${lastEndDay}${lastEndSuffix}
      ${
        lastEndMonth !== prevEndMonth || lastEndYear !== prevEndYear
          ? `of ${lastEndMonth}`
          : ""
      }
      ${prevEndYear !== lastEndYear ? `, ${lastEndYear}` : ""}
      

      vs.
      
      ${prevStartDayName}, ${prevStartDay}${prevStartSuffix}
      ${
        prevStartMonth !== prevEndMonth || prevStartYear !== prevEndYear
          ? `of ${prevStartMonth}`
          : ""
      }
      ${prevStartYear !== prevEndYear ? `, ${prevStartYear}` : ""}

      -

      ${prevEndDayName}, ${prevEndDay}${prevEndSuffix}

      of ${prevEndMonth}, ${prevEndYear}
    `;

    default:
      return false;
  }
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
    .map((offset) => new Date(now.setDate(now.getDate() - offset)));
};

export const getTotalInTimeRange = (data, type, breakpointDates) => {
  let lastPeriodTotal = 0;
  let prevPeriodTotal = 0;

  const [
    lastPeriodEndDate,
    lastPeriodStartDate,
    prevPeriodEndDate,
    prevPeriodStartDate,
  ] = breakpointDates; // date objects

  /* iterating through all countries */
  Object.values(data).forEach((country) => {
    const getIndex = (date) =>
      Object.keys(country).findIndex((key) => key === getDateString(date));
    const lastEndIndex = getIndex(lastPeriodEndDate);
    const lastStartIndex = getIndex(lastPeriodStartDate);
    const prevEndIndex = getIndex(prevPeriodEndDate);
    const prevStartIndex = getIndex(prevPeriodStartDate);

    const getPeriodTotal = (startIndex, endIndex) => {
      return Object.values(country)
        .map((date) => date[type])
        .reduce((acc, curr, index) => {
          if (index >= startIndex && index <= endIndex) {
            acc += curr;
          }
          return acc;
        }, 0);
    };

    prevPeriodTotal += getPeriodTotal(prevStartIndex, prevEndIndex);
    lastPeriodTotal += getPeriodTotal(lastStartIndex, lastEndIndex);
  });
  const percentage =
    prevPeriodTotal !== 0
      ? Math.round(
          ((lastPeriodTotal - prevPeriodTotal) / prevPeriodTotal) * 1000
        ) / 10
      : 100;
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

export const getColorRgb = (id) => {
  // temporary solution
  const svgIcon = document.querySelector(`svg[class*=${id}]`);
  if (svgIcon) {
    const style = window.getComputedStyle(svgIcon);
    return style.getPropertyValue("background-color");
  } else {
    const colors = {
      income: "rgb(41, 191, 215)",
      users: "rgb(188, 215, 74)",
      orders: "rgb(254, 152, 51)",
      complaints: "rgb(250, 80, 80)",
    };
    return colors[id];
  }
};

const getColor = (id) => getColorRgb(id).match(/\d+/g);

const get2digit = (number) => (number < 10 ? `0${number}` : `${number}`);

const autoCompleteDates = (array, type) => {
  if (array.length === 0) return array;

  // autocomplete array with the missing date string
  // since a first day of the month
  if (type === "days") {
    const [year, month, day] = array[0].split("-");
    const prevDay = parseInt(day) - 1;

    for (let i = prevDay; i > 0; i--) {
      array.unshift(`${year}-${month}-${get2digit(i)}`);
    }
    return array;

    // autocomplete array with the missing months in a given year
  } else if (type === "months") {
    const firstDate = array[0];
    const lastDate = array[array.length - 1];

    const [firstYear, firstMonth] = firstDate.split("-");
    const [lastYear, lastMonth] = lastDate.split("-");
    const prevMonth = parseInt(firstMonth) - 1;
    const nextMonth = parseInt(lastMonth) + 1;

    // autocomplete months before first month in a given year
    for (let i = prevMonth; i > 0; i--) {
      array.unshift(`${firstYear}-${get2digit(i)}`);
    }

    // autocomplete months after last month in a given year
    for (let i = nextMonth; i <= 12; i++) {
      array.push(`${lastYear}-${get2digit(i)}`);
    }
    return array;
  }
};

const getDateIds = (array, isYearly) => {
  // returns array of strings formatted as:
  // yyy-mm-dd when isYearly is false
  // yyy-mm when isYearly is true

  const allDaysAsDates = array.map(([elem]) => elem);
  const daysAsDates = [...new Set(allDaysAsDates)];
  const allMonthsAsDates = daysAsDates.map((date) =>
    date.split("-").slice(0, 2).join("-")
  );
  const monthsAsDates = [...new Set(allMonthsAsDates)];
  const daysOutput = autoCompleteDates(daysAsDates, "days");
  const monthsOutput = autoCompleteDates(monthsAsDates, "months");
  return isYearly ? monthsOutput : daysOutput;
};

export const getMapData = (data, field, month, year) => {
  const mapData = {};
  const countriesTotals = {};
  const [r, g, b] = getColor(field);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  Object.entries(data).forEach(([countryName, values]) => {
    countriesTotals[countryName] = Object.entries(values)
      .filter(([date]) => {
        const [y, m] = date.split("-").map((elem) => parseInt(elem));
        return monthNum === 0 ? y === yearNum : m === monthNum && y === yearNum;
      })
      .map(([date, values]) => values[field])
      .reduce((acc, curr) => acc + curr, 0);
  });

  const totalsArray = Object.values(countriesTotals);
  const maxTotal = Math.max(...totalsArray);
  const allCountriesTotal = totalsArray.reduce((a, b) => a + b, 0);

  Object.keys(data).forEach((countryName) => {
    const countryCode = countryCodes[countryName];
    if (countryCode) {
      const countryTotal = countriesTotals[countryName];
      const countryPercent = (countryTotal / allCountriesTotal) * 100;
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
  return mapData;
};

export const getHistData = (data, field, month, year, isAllBefore = false) => {
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  const histArray = [];

  Object.values(data).forEach((datesObj) => {
    histArray.push(...Object.entries(datesObj));
  });

  // returns filtered and sorted array of all date-value elements
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

  // get array of date strings formatted as:
  // yyy-mm-dd when isYearly is false
  // yyy-mm when isYearly is true

  const isYearly = monthNum === 0;
  const dateStrings = getDateIds(filteredHistArray, isYearly);

  const histData = dateStrings.map((dateString, index) => {
    const value = filteredHistArray
      .filter(([date]) => date.includes(dateString))
      .map(([date, values]) => values[field])
      .reduce((a, b) => a + b, 0);

    return {
      id: `${index + 1} ${months[month]}`,
      month: months[month],
      [field]: value,
    };
  });
  return histData;
};

export const getSummaryData = (data, month, year) => {
  const getFieldTotals = () => {
    let array = [];
    for (let field in statsFields) {
      const beforeTotal = getTotal(field, true);
      const currentTotal = getTotal(field, false);
      const allTotal = beforeTotal + currentTotal;

      if (allTotal !== 0) {
        
        const beforePercent = (beforeTotal / allTotal) * 100;
        const currentPercent = (currentTotal / allTotal) * 100;
  
        array.unshift({
          id: field,
          [`${field}Before`]: beforePercent,
          [`${field}Current`]: currentPercent,
        });
      }
    }
    return array;
  };

  const getTotal = (field, isAllBefore) => {
    const temp = getHistData(data, field, month, year, isAllBefore);
    return temp.map((elem) => elem[field]).reduce((a, b) => a + b, 0);
  };

  return getFieldTotals();
};
