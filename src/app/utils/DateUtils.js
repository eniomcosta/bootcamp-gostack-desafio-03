class DateUtils {
  static isValidDate(dateString) {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format
    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  }

  static isValidTime(timeString) {
    const regEx = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
    if (!timeString.match(regEx)) return false; // Invalid format
    return true;
  }

  static parseDateAndTimeToDate(dateString, timeString) {
    if (!this.isValidDate(dateString)) {
      throw new Error('Date format is invalid to parse');
    }

    if (!this.isValidTime(timeString)) {
      throw new Error('Time format is invalid to parse');
    }

    const [year, month, day] = dateString.split('-');

    const [hour, minute] = timeString.split(':');

    return new Date(year, month, day, hour, minute);
  }
}

export default DateUtils;
