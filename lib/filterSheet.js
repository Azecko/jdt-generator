const moment = require("moment");
const getSpreadSheet = require("./getSpreadSheet");
module.exports = async function filterSheet(startDate, endDate) {
    let sheet = await getSpreadSheet();

    sheet = sheet.filter(row => {
        if(row.morning_start && row.morning_end && row.afternoon_start && row.afternoon_end) {
            let rowDate = moment(row.date, "DD/MM/YYYY").toDate();
            return moment(rowDate).isBetween(startDate, endDate);
        }
    });

    return sheet
}