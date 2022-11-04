const moment = require("moment")
module.exports = async function generateTelegramMessage(sheet) {
    sheet.forEach((element) => (element["frenchDay"] = moment(element.date, 'DD/MM/YYYY').locale("fr").format("dddd").charAt(0).toUpperCase() + moment(element.date, 'DD/MM/YYYY').locale("fr").format("dddd").slice(1))); // Add day in French in each element
    let minimHours = sheet.length * 8.2
    let totalHours = moment.duration()
    let telegramReport = "";
    telegramReport+= `
The JDT from ${moment(sheet[0].date, "DD/MM/YYYY").toDate().toLocaleDateString('fr-FR')} to ${moment(sheet[sheet.length - 1].date, "DD/MM/YYYY").toDate().toLocaleDateString('fr-FR')} is ready to be sent :
    <br />`
    sheet.map(element => {
        totalHours.add(moment.duration(element.total));
        telegramReport+= `
<i><u>${element.frenchDay} ${element.date}</u></i>

<strong>${element.morning_start}</strong> -> <strong>${element.morning_end}</strong> -> <strong>${element.afternoon_start}</strong> -> <strong>${element.afternoon_end}</strong>
Total du jour : <strong>${element.total}</strong><br />
        
<strong><u>Description</u></strong><br />
        
${element.comment}
<br />
`
    })
    let hoursDiff = moment.utc(Math.round(moment.duration(totalHours.asHours() - minimHours, "hours").as('milliseconds'))).format('HH:mm')
    telegramReport+= `
Total : <u>${Math.floor(totalHours.asHours())}:${totalHours.minutes()}</u>
    
Heures supplémentaires : <u>${hoursDiff}</u>
`

    return telegramReport;
}