const getSpreadSheet = require("./lib/getSpreadSheet");
const generateReport = require("./lib/generateReport");
(async () => {
    let sheet = await getSpreadSheet.getSpreadSheet();

    await generateReport(sheet);
    
})();