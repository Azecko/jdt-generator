const { Telegraf } = require('telegraf');
const generateTelegramMessage = require('./lib/generateTelegramMessage');
const filterSheet = require('./lib/filterSheet');
const bot = new Telegraf(process.env.BOT_TOKEN);
const showdown = require('showdown');
const converter = new showdown.Converter();
require('dotenv').config();

async function telegram() {

    var prevMonday = new Date();
    prevMonday.setDate((prevMonday.getDate() - (prevMonday.getDay() + 6) % 7) -1);

    var friday = new Date();
    friday.setDate(prevMonday.getDate() + 4);

    var jdtFiltered = await filterSheet(prevMonday, friday)
    var mdReport = await generateTelegramMessage(jdtFiltered);

    var html = converter.makeHtml(mdReport).replace(/<\/?p[^>]*>/g, '').replace(/<\/?br[^>]*>/g, '\n');

    bot.telegram.sendMessage(process.env.CHAT_ID, html, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [ { text: "Yes", callback_data: "yes" }, { text: "No", callback_data: "no" } ],
            ]
        }
    });

    bot.action('yes', ctx => {
        ctx.editMessageReplyMarkup();
        ctx.reply('You clicked yes');
    });

    bot.action('no', ctx => {
        ctx.editMessageReplyMarkup();
        ctx.reply('You clicked no');
    });

    bot.launch();
}

telegram();