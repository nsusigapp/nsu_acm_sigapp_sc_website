
// helper function for formatting dates fetched from Database;
const dateFormat = date => {

    const formatDate = new Date(date);

    const monthName = ["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = monthName[formatDate.getMonth()];
    const year = formatDate.getFullYear();
    const day = formatDate.getDate();

    let hr = formatDate.getHours();
    let min = formatDate.getMinutes();
    let ampm = "AM";

    hr = hr === 0 ? 12 : hr;

    if (min < 10) {
        min = "0" + min;
    }

    if (hr > 12) {
        hr -= 12;
        ampm = "PM";
    }

    return `${day} ${month}, ${year}, ${hr}:${min} ${ampm}`;
}

module.exports = dateFormat;
