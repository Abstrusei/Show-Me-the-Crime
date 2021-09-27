function createDate(date) {
    const MONTH = ["January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"];
    var createdDate;
    var newDate;
    date = date[3] + date[4] + date;
    createdDate = new Date(date);
    var month = createdDate.getMonth(); //months from 1-12
    var year = createdDate.getUTCFullYear();

    newDate = MONTH[month] + " " + year;
    return newDate;
}