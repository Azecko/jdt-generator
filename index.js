const getSpreadSheet = require("./lib/getSpreadSheet");
const generateReport = require("./lib/generateReport");
const { program } = require('commander');
const moment = require("moment")

let startDate;
let endDate;

function checkValidDates(fromDate, toDate) {
    if(moment(fromDate, "YYYY-MM-DD", true).isValid() && moment(toDate, "YYYY-MM-DD", true).isValid()) {
        return true;
    }
    return false;
}

program
  .name('jdt-generator')
  .description('Journal de travail generator coded by Azecko')
  .version('0.8.0');

program.command('md')
  .description('Generate a journal de travail between two dates as a MarkDown file, usage : `md --from=<Date> --to=<Date>`')
  .requiredOption('--from <date>', 'Starting date, exemple : 2022-01-30')
  .requiredOption('--to <date>', 'End date, exemple : 2022-12-29')
  .action((str, options) => {
    startDate = str.from
    endDate = str.to
  });

program.parse();

(async () => {
    if(!checkValidDates(startDate, endDate)) {
        return console.log("Please enter two valid dates formatted like  : 2022-01-30 (YYYY-MM-DD)")
    }
    startDate = new Date(startDate);
    endDate = new Date(endDate)

    let sheet = await getSpreadSheet();
    startDate.setDate(startDate.getDate()-1);

    sheet = sheet.filter(row => {
        if(row.morning_start && row.morning_end && row.afternoon_start && row.afternoon_end) {
            let rowDate = moment(row.date, "DD/MM/YYYY").toDate();
            return moment(rowDate).isBetween(startDate, endDate);
        }
    });
    
    var mdReport = await generateReport(sheet);
    console.log(mdReport);
    
})();