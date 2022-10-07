const getSpreadSheet = require("./lib/getSpreadSheet");
const generateReport = require("./lib/generateReport");
const moment = require("moment");
(async () => {
    let sheet = await getSpreadSheet();
    var startDate = new Date("2022-09-26");
    startDate.setDate(startDate.getDate()-1);
    var endDate = new Date("2022-10-07");

    sheet = sheet.filter(row => {
        if(row.morning_start && row.morning_end && row.afternoon_start && row.afternoon_end) {
            let rowDate = moment(row.date, "DD/MM/YYYY").toDate();
            return moment(rowDate).isBetween(startDate, endDate);
        }
    });
    
    generateReport(sheet);
    
})();