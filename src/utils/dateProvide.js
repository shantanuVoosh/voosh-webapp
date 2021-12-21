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
    time.getFullYear() + "-" + time.getMonth() + "-" + time.getDate();
  return format;
}

const getCurrentDateBefore12HoursAgo = () => {
  // const time = new Date();
  const tenHoursBefore = new Date();
  tenHoursBefore.setHours(tenHoursBefore.getHours() - 12);
  // console.log("Day:", tenHoursBefore.getDate(), "tenHoursBefore");
  const format =
    tenHoursBefore.getFullYear() + "-" + tenHoursBefore.getMonth() + "-" + tenHoursBefore.getDate();
  return format;

}

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

module.exports = {
  getTimeLog,
  getCurrentDate,
  getYesterdayDate,
  getTomorrowDate,
  getCurrentDateBefore12HoursAgo
};
