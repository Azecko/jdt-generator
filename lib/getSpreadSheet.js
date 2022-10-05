// Récupérer les donneés dans le doc
require('dotenv').config()
const creds = require(process.env.JSON_ENV_PATH)
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.DOC_ID);
const getSpreadSheet = async () => {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells()

    return sheet
}
module.exports = {getSpreadSheet}