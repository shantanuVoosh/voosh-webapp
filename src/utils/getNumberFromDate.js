// console.log(getWeekNumberFromDate("2021-12-27"))
//52

// console.log(getWeekNumberFromDate("2021-12-24"))
//51

// console.log(getWeekNumberFromDate("2022-1-1"))
//52

// console.log(getWeekNumberFromDate("2022-1-3"))
//1

function getWeekNumberFromDate(date) {
  var d = new Date(date);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart = new Date(d.getFullYear(), 0, 1);
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

function getMonthNumberFromDate(date) {
  var month = date.getMonth() + 1;
  return month;
}

module.exports = { getMonthNumberFromDate, getWeekNumberFromDate };
