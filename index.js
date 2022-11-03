const getSpreadSheet = require("./lib/getSpreadSheet");
const generateReport = require("./lib/generateReport");
const sendMail = require("./lib/sendMail");
const { program } = require('commander');
const moment = require("moment");
const showdown = require("showdown");
const filterSheet = require("./lib/filterSheet");
const converter = new showdown.Converter({tables: 'true'});

let mode;

let startDate;
let endDate;
let receiver;
let subject;

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
  .description('Log your journal de travail as MarkDown format. Usage : `md --from=<Date> --to=<Date>`')
  .requiredOption('--from <date>', 'Starting date, example : 2022-01-30')
  .requiredOption('--to <date>', 'End date, example : 2022-12-29')
  .action((str, options) => {
    mode = "md"
    startDate = str.from
    endDate = str.to
  });

program.command('email')
  .description('Send an e-mail with your journal de travail to a specific email. Usage : `email --from=<Date> --to=<Date> --receiver=<Email> --subject=<String>`')
  .requiredOption('--from <date>', 'Starting date, example : 2022-01-30')
  .requiredOption('--to <date>', 'End date, example : 2022-12-29')
  .requiredOption('--receiver <email>', 'Email who will receive the email.')
  .requiredOption('--subject <string>', 'Subject of the email, example : `--subject="My report of this weeK"`')
  .action((str, options) => {
    mode = "email"
    startDate = str.from
    endDate = str.to
    receiver = str.receiver
    subject = str.subject
  });

program.parse();

(async () => {
    if(!checkValidDates(startDate, endDate)) {
        return console.log("Please enter two valid dates formatted like  : 2022-01-30 (YYYY-MM-DD)")
    }
    startDate = new Date(startDate);
    endDate = new Date(endDate)
    startDate.setDate(startDate.getDate()-1);

    let sheet = await filterSheet(startDate, endDate)
    
    var mdReport = await generateReport(sheet);
    switch (mode) {
      case 'md':
        console.log(mdReport);
      break;

      case 'email':
        const css = `<style>
        table {
          border: 1px solid gray;
          border-spacing: 0px;
          border-collapse: separate;
        }
        th, td {
          border: 1px solid gray;
          padding: 10px;
        }
        </style>`
        var html = converter.makeHtml(css + mdReport);
        sendMail(receiver, subject, html);
      break;
    }
    
})();