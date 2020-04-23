import {getStartDateString, getRandom} from "./dataHandlers";

export const countriesList = [
  {
    country: "Poland",
    startDate: [2017, 12, 5],
  },
  {
    country: "Usa",
    startDate: [2018, 5, 24],
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
    let dateString = getStartDateString(date);
    const todaysDateString = getStartDateString(todaysDate);

    data[country] = {};

    // generate data for each consecutive date
    while (dateString !== todaysDateString) {
      date.setDate(date.getDate() + 1);
      dateString = getStartDateString(date);
      data[country][dateString] = {};
      data[country][dateString].profit = getRandom(-300, 2200);
      data[country][dateString].users = getRandom(0, 80);
      data[country][dateString].orders = getRandom(0, 50);
      data[country][dateString].complaints = getRandom(0, 5);
    }
  });

  return data;
};
