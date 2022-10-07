require('dotenv').config()
const creds = require(process.env.JSON_ENV_PATH)
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.DOC_ID);
module.exports = async function getSpreadSheet() {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    let timeSheetData = []
    for (let row of rows) {
        timeSheetData.push({
            "date": row._rawData[2] || null,
            "morning_start": row._rawData[3] || null,
            "morning_end": row._rawData[4] || null,
            "afternoon_start": row._rawData[5] || null,
            "afternoon_end": row._rawData[6] || null,
            "total": row._rawData[7] || null,
            "comment": row._rawData[8] ? row._rawData[8].replace(/\n/g, '<br>') : null,
        })
    }

    return timeSheetData
}
