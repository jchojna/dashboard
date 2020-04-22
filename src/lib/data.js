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
    const {country, startDate: [year, month, day]} = item;
    const getStartDateString = (date) => date.toISOString().slice(0,10);

    const date = new Date(year, month - 1, day);
    const todaysDate = new Date();
    let dateString = getStartDateString(date);
    const todaysDateString = getStartDateString(todaysDate);

    data[country] = {};

    // generate data for each consecutive date
    while(dateString !== todaysDateString) {

      date.setDate(date.getDate() + 1);
      dateString = getStartDateString(date);
      data[country][dateString] = {};
      data[country][dateString].profit = 'a';
      data[country][dateString].users = 'b';
      data[country][dateString].orders = 'c';
      data[country][dateString].complaints = 'd';
    }
  });

  console.log(data);
};
