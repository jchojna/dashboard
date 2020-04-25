import {getDateString, getRandom} from "./dataHandlers";

export const countriesList = [
  {
    country: "Poland",
    startDate: [2017, 12, 5],
  },
  {
    country: "Germany",
    startDate: [2019, 11, 3],
  },
  {
    country: "United States",
    startDate: [2018, 5, 24],
  },
  {
    country: "United Kingdom",
    startDate: [2018, 3, 17],
  },
];

export const getData = (list) => {
  const data = {};

  list.forEach((item) => {
    const {
      country,
      startDate: [year, month, day],
    } = item;

    const date = new Date(year, month - 1, day);
    const todaysDate = new Date();
    let dateString = getDateString(date);
    const todaysDateString = getDateString(todaysDate);

    data[country] = {};

    // generate data for each consecutive date
    while (dateString !== todaysDateString) {
      date.setDate(date.getDate() + 1);
      dateString = getDateString(date);
      data[country][dateString] = {};
      data[country][dateString].profit = getRandom(-300, 2200);
      data[country][dateString].users = getRandom(0, 80);
      data[country][dateString].orders = getRandom(0, 50);
      data[country][dateString].complaints = getRandom(0, 5);
    }
  });

  return data;
};
