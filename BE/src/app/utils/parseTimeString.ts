export function parseTimeString(timeStr: string) {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1].substr(0, 2));
    const amPm = parts[1].substr(2).toUpperCase();

    const date = new Date();

    if (amPm === "PM" && hours !== 12) {
        date.setHours(hours + 12);
    } else if (amPm === "AM" && hours === 12) {
        date.setHours(0);
    } else {
        date.setHours(hours);
    }

    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}