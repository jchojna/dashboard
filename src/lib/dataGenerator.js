import {getDateString, getRandom} from "./dataHandlers";

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
      data[country][dateString].income = getRandom(0, 3000);
      data[country][dateString].users = getRandom(0, 80);
      data[country][dateString].orders = getRandom(0, 50);
      data[country][dateString].complaints = getRandom(0, 5);
    }
  });

  return data;
};
