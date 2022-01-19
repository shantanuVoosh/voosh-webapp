import moment from "moment";

//* console.log(getWeekNumberFromDate("2022-1-1")) -->52
export function getWeekNumberFromDate(date) {
  var d = new Date(date);
  d.setHours(0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  var yearStart = new Date(d.getFullYear(), 0, 1);
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

//* console.log(getMonthNumberFromDate("2022-1-3")) -->1
export function getMonthNumberFromDate(date) {
  var d = new Date(date);
  var month = d.getMonth() + 1;
  return month;
}

//* if today is 2022-1-1, then 2021-12-31 after 12 hours or 2021-12-30
export const getPreviousDay12HoursAgoDate = () => {
  const m = moment();
  const result = m.add(-12, "hours").add(-1, "days").format("YYYY-MM-DD");
  return result;
};

// * if current month is 2022-01-01, then 2021-12-25
// * if current month is 2022-01-02, then 2021-12-26
// * if current month is 2022-01-03, then 2021-12-27
export const getPreviousWeekDate = () => {
  const m = moment(getPreviousDay12HoursAgoDate());
  // const m = moment().add(1, "days");
  //   console.log("This will be the curr adte", m.format("YYYY-MM-DD"));
  const result = m.add(-7, "days").format("YYYY-MM-DD");
  return result;
};

export const getPreviousMonthDate = () => {
  const m = moment();
  // const m = moment().add(1, "days");
  // console.log("This will be the curr adte", m.format("YYYY-MM-DD"));
  const result = m.add(-1, "months").format("YYYY-MM-DD");
  return result;
};

export function getCurrentMonthDate() {
  const time = new Date();
  const d = time.getDate();
  const m = time.getMonth() + 1;
  const y = time.getFullYear();
  const format = `${y}-${m}-${d}`;
  return format;
}

export function currentWeekStartAndEndDate() {
  const startDate = moment()
    .add(-12, "hours")
    .add(-1, "days")
    .startOf("isoWeek")
    .format("D MMM'YY");
  const endDate = moment()
    .add(-12, "hours")
    .add(-1, "days")
    .endOf("isoWeek")
    .format("D MMM'YY");
  return { startDate, endDate };
}

export function PreviousWeekStartAndEndDate() {
  const startDate = moment()
    .add(-12, "hours")
    .add(-1, "days")
    .add(-1, "weeks")
    .startOf("isoWeek")
    .format("D MMM'YY");
  const endDate = moment()
    .add(-12, "hours")
    .add(-1, "days")
    .add(-1, "weeks")
    .endOf("isoWeek")
    .format("D MMM'YY");
  return { startDate, endDate };
}
export function MonthStringProvider(date) {
  console.log("date--------->", date);
  return moment(new Date(date)).format("MMM-YYYY");
}

// ! this is for Custom Date Range
export function getCustomDateInFormat(date) {
  return moment(new Date(date)).format("YYYY-MM-DD");
}
