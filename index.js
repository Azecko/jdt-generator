require('dotenv').config()
const creds = require(process.env.JSON_ENV_PATH)
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.DOC_ID);
(async () => {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells()

    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7)
    var formattedMonday = prevMonday.toLocaleDateString('fr-FR') // last monday

    for (let i = 2; i < 1000; i++) {
        var cell = sheet.getCellByA1(`C${i}`)
        if(cell.formattedValue == formattedMonday) {
            const row = await sheet.getRows()
            var mondayRow = cell.a1Row - 2
            for (let i = mondayRow; i < mondayRow + 5; i++) {
                var day = row[i]
                var heureArrive = day["Heure d’arrivée"]
                var heureManger = day["Heure de départ (manger)"]
                var heureRetour = day["Heure de retour"]
                var heureDepart = day["Heure de départ"]
                console.log(heureArrive, heureManger, heureRetour, heureDepart)
            }
        }
    }
    
})();