// ! Get Current Time
export function getTimeLog() {
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

export function getCurrentDate() {
  const time = new Date();
  const tenHoursBefore = new Date();
  tenHoursBefore.setHours(tenHoursBefore.getHours() - 20);
  console.log("Day:", tenHoursBefore.getDate(), "tenHoursBefore");

  const format =
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
  return format;
}

export const getCurrentDateBefore12HoursAgo = () => {
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
export const getYesterdayDateBefore12HoursAgo = () => {
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

export function getPreviousWeek() {
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
export function getYesterdayDate() {
  const time = new Date();
  const format =
    time.getFullYear() +
    "-" +
    (time.getMonth() + 1) +
    "-" +
    (time.getDate() - 1);
  return format;
}

export function getTomorrowDate() {
  const time = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const format =
    time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
  return format;
}

// ? Month
// ! 2021-12
export function getCurrentMonth() {
  const time = new Date();
  const format = time.getFullYear() + "-" + (time.getMonth() + 1);
  return format;
}

export function getPreviousMonth() {
  const time = new Date();
  const format =
    time.getFullYear() + "-" + time.getMonth() + "-" + time.getDate();
  return format;
}


// console.log(getWeekNumberFromDate("2021-12-27"))
//52

// console.log(getWeekNumberFromDate("2021-12-24"))
//51

// console.log(getWeekNumberFromDate("2022-1-1"))
//52

// console.log(getWeekNumberFromDate("2022-1-3"))
//1

export function getWeekNumberFromDate(date) {
  var d = new Date(date);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart = new Date(d.getFullYear(), 0, 1);
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

export function getMonthNumberFromDate(date) {
  var d = new Date(date);
  var month = d.getMonth() + 1;
  return month;
}

