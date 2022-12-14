const moment = require("moment")
module.exports = async function generateReport(sheet) {
    sheet.forEach((element) => (element["frenchDay"] = moment(element.date, 'DD/MM/YYYY').locale("fr").format("dddd").charAt(0).toUpperCase() + moment(element.date, 'DD/MM/YYYY').locale("fr").format("dddd").slice(1))); // Add day in French in each element
    let minimHours = sheet.length * 8.2
    let totalHours = moment.duration()
    let mdReport = "";
    mdReport+= `
# Journal de travail du ${moment(sheet[0].date, "DD/MM/YYYY").toDate().toLocaleDateString('fr-FR')} au ${moment(sheet[sheet.length - 1].date, "DD/MM/YYYY").toDate().toLocaleDateString('fr-FR')}
    `
    sheet.map(element => {
        totalHours.add(moment.duration(element.total));
        mdReport+= `
### ${element.frenchDay} ${element.date}
        
| Heure d'arrivée | Heure de départ (manger) | Heure de retour | Heure de départ | Total |
|-----------------|--------------------------|-----------------|-----------------|-------|
| ${element.morning_start} | ${element.morning_end} | ${element.afternoon_start} | ${element.afternoon_end} | ${element.total} |
        
#### Description
        
${element.comment}
`
    })
    let hoursDiff = moment.utc(Math.round(moment.duration(totalHours.asHours() - minimHours, "hours").as('milliseconds'))).format('HH:mm')
    mdReport+= `
## Total : <u>${Math.floor(totalHours.asHours())}:${totalHours.minutes()}</u>
    
## Heures supplémentaires : <u>${hoursDiff}</u>
`
    mdReport+= `<i><small>Generated using [jdt-generator](https://github.com/Azecko/jdt-generator) by [Azecko](https://github.com/Azecko)</small></i>`

    return mdReport;
}