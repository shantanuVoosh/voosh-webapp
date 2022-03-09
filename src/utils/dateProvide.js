// ! Get Current Time
function getTimeLog() {
  const time = new Date();

  const format =
    time.getDate() +
    "/" +
    time.getMonth() +
    "/" +
    time.getFullYear() +
    "-" +
    time.getHours() +
    ":" +
    time.getMinutes() +
    ":" +
    time.getSeconds() +
    ":" +
    time.getMilliseconds();
  return format;
}

function getCurrentDate() {
  const time = new Date();
  const tenHoursBefore = new Date();
  tenHoursBefore.setHours(tenHoursBefore.getHours() - 20);
  console.log("Day:", tenHoursBefore.getDate(), "tenHoursBefore");

  const format =
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
  return format;
}

const getCurrentDateBefore12HoursAgo = () => {
  // const time = new Date();
  const tenHoursBefore = new Date();
  tenHoursBefore.setHours(tenHoursBefore.getHours() - 12);
  // console.log("Day:", tenHoursBefore.getDate(), "tenHoursBefore");
  const format =
    tenHoursBefore.getFullYear() +
    "-" +
    (tenHoursBefore.getMonth() + 1) +
    "-" +
    tenHoursBefore.getDate();
  return format;
};
const getYesterdayDateBefore12HoursAgo = () => {
  // const time = new Date();
  const tenHoursBefore = new Date();
  tenHoursBefore.setHours(tenHoursBefore.getHours() - 12);
  // console.log("Day:", tenHoursBefore.getDate(), "tenHoursBefore");
  const format =
    tenHoursBefore.getFullYear() +
    "-" +
    (tenHoursBefore.getMonth() + 1) +
    "-" +
    (tenHoursBefore.getDate() - 1);
  return format;
};

function getPreviousWeek() {
  const time = new Date();
  const format =
    time.getFullYear() +
    "-" +
    (time.getMonth() + 1) +
    "-" +
    (time.getDate() - 7);
  return format;
}
// !extra 1 day+
function getYesterdayDate() {
  const time = new Date();
  const format =
    time.getFullYear() +
    "-" +
    (time.getMonth() + 1) +
    "-" +
    (time.getDate() - 1);
  return format;
}

function getTomorrowDate() {
  const time = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const format =
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
  return format;
}

// ? Month
// ! 2021-12
function getCurrentMonth() {
  const time = new Date();
  const format =
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
  return format;
}

function getPreviousMonth() {
  const time = new Date();
  const format =
    time.getFullYear() + "-" + time.getMonth() + "-" + time.getDate();
  return format;
}
// ?12 hr ago
const getPreviousDay12HoursAgo = () => {
  const time = new Date();
  time.setHours(time.getHours() - 12);
  const format =
    (time.getMonth() +1) +
    "-" +
    (time.getDate() - 1) +
    "-" +
    time.getFullYear();
  return format;
};

// ! get Month start and end date
function getMonthStartAndEndDateFromYearMonth(year, month) {
  // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
  // array is 'year', 'month', 'day', etc
  const startDate = moment([year, month - 1]);
  // .format("DD-MMM-YYYY");

  // Clone the value before .endOf()
  const endDate = moment(startDate).endOf("month");
  // .format("DD-MMM-YYYY");

  return {
    start: startDate.format("DD-MMM-YYYY"),
    end: endDate.format("DD-MMM-YYYY"),
  };
}
// ! get Week start and end date
function geWeekStartAndEndDateFromYearMonth(year, week) {
  const startDate = moment(`${year}`)
    .add(-12, "hours")
    .add(week, "weeks")
    .startOf("isoWeek");
  const endDate = moment(`${year}`)
    .add(-12, "hours")
    .add(week, "weeks")
    .endOf("isoWeek");
  
  return {
    start: startDate.format("DD-MMM-YYYY"),
    end: endDate.format("DD-MMM-YYYY"),
  };
}

module.exports = {
  getTimeLog,
  getCurrentDate,
  getYesterdayDate,
  getTomorrowDate,
  getCurrentDateBefore12HoursAgo,
  getYesterdayDateBefore12HoursAgo,
  getPreviousWeek,
  getPreviousMonth,
  getPreviousDay12HoursAgo,
  getMonthStartAndEndDateFromYearMonth,
  geWeekStartAndEndDateFromYearMonth
};
