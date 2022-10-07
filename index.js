const getSpreadSheet = require("./lib/getSpreadSheet");
const generateReport = require("./lib/generateReport");
(async () => {
    let sheet = await getSpreadSheet();

    await generateReport(sheet);
    
})();