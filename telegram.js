const { Telegraf } = require('telegraf');
const generateTelegramMessage = require('./lib/generateTelegramMessage');
const filterSheet = require('./lib/filterSheet');
const bot = new Telegraf(process.env.BOT_TOKEN);
const showdown = require('showdown');
const converter = new showdown.Converter();
const { exec } = require('child_process');
const moment = require('moment');
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
        exec(`node index.js email --from=${prevMonday.toISOString().split('T')[0]} --to=${friday.toISOString().split('T')[0]} --receiver="${process.env.TELEGRAM_MAIL}" --subject="${process.env.TELEGRAM_MAIL_SUBJECT}"`, (err, stdout, stderr) => {
            if (err) {
              bot.telegram.sendMessage(process.env.CHAT_ID, 'I got a problem sending the email !');
              return;
            }

            bot.telegram.sendMessage(process.env.CHAT_ID, `Email has been sent to ${process.env.TELEGRAM_MAIL}`);

            bot.stop();
        });          
    });

    bot.action('no', async ctx => {
        ctx.editMessageReplyMarkup();
        
        bot.telegram.sendMessage(process.env.CHAT_ID, `Okay, I'm not sending an email for this JDT.`)

        bot.stop();    
    });

    bot.launch();
}

telegram();