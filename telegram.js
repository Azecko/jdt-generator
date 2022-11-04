const { Telegraf } = require('telegraf');
const generateTelegramMessage = require('./lib/generateTelegramMessage');
const filterSheet = require('./lib/filterSheet');
const sendMail = require('./lib/sendMail');
const bot = new Telegraf(process.env.BOT_TOKEN);
const showdown = require('showdown');
const converter = new showdown.Converter({tables: 'true'});
const { exec } = require('child_process');
const moment = require('moment');
const generateReport = require('./lib/generateReport');
require('dotenv').config();

async function telegram() {

    var prevMonday = new Date();
    prevMonday.setDate((prevMonday.getDate() - (prevMonday.getDay() + 6) % 7) -1);

    var friday = moment(prevMonday).add('5', 'days');

    var jdtFiltered = await filterSheet(prevMonday, friday)
    var mdReport = await generateTelegramMessage(jdtFiltered);

    var html = converter.makeHtml(mdReport).replace(/<\/?p[^>]*>/g, '').replace(/<\/?br[^>]*>/g, '\n');

    bot.telegram.sendMessage(process.env.CHAT_ID, html, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [ { text: `Send mail to ${process.env.TELEGRAM_MAIL}`, callback_data: "yes" } ],
                [ { text: "Do not send mail", callback_data: "no" } ]
            ]
        }
    });

    bot.action('yes', async ctx => {
        ctx.editMessageReplyMarkup();
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
        var mdReport = await generateReport(jdtFiltered);
        var html = converter.makeHtml(css + mdReport);
        await sendMail(process.env.TELEGRAM_MAIL, process.env.TELEGRAM_MAIL_SUBJECT, html);

        bot.telegram.sendMessage(process.env.CHAT_ID, `Email has been sent to ${process.env.TELEGRAM_MAIL}`);

        bot.stop();        
    });

    bot.action('no', async ctx => {
        ctx.editMessageReplyMarkup();
        
        bot.telegram.sendMessage(process.env.CHAT_ID, `Okay, I'm not sending an email for this JDT.`)

        bot.stop();    
    });

    bot.launch();
}

telegram();