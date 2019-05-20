// helper function for formatting dates fetched from Database;
const dateFormat = date => {

    const formatDate = new Date(date);

    const monthName = ["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sep","Oct","Nov","Dec"];
    const month = monthName[formatDate.getMonth()];
    const year = formatDate.getFullYear();
    const day = formatDate.getDate();

    return `${day} ${month}, ${year}`;
}

module.exports = dateFormat;
