exports.getTimeDiff = (date1, date2) => {
  return (Date.parse(date2) - Date.parse(date1)) / 60000;
};

exports.getWeekday = (date) => {
  return 0 < new Date(date).getDay() && new Date(date).getDay() < 6;
};
