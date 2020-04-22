export const stats = [
  {id: "profit", heading: "Total Profit"},
  {id: "users", heading: "Active users"},
  {id: "orders", heading: "New orders"},
  {id: "complaints", heading: "Open complaints"},
];

export const getTotalInTimeRange = (data, type) => {
  let total = 0;

  Object.values(data).forEach((country) => {
    total += Object.values(country)
      .map((date) => date[type])
      .reduce((acc, curr) => acc + curr, 0);
  });

  return total;
};
