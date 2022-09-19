module.exports = (dateNowUTC) => {
  return dateNowUTC.toLocaleString("en-US", { timeZone: "America/Regina" });
}