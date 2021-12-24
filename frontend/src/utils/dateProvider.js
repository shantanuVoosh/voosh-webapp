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
