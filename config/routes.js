/* Copyright (c) 2020-2024 Reminano */

/**
 * Created by A on 7/18/17.
 */
'use strict';
const Logger = require('../utils/logging');
//System & Utilites modules
const Upload = require('../API/Upload/route/UploadRoute');

//FEATURE 2023020601 Improve Security of APIs
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN || '5665305274:AAFlhbcpNijafxo9sCNqO2CBuojoRNP5ZFc';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: false });

const chatId = process.env.TELEGRAM_CHAT_ID || '@BuildNotify';

let APIs = [
  //FEATURE 2023020601 Improve Security of APIs
  {
    method: 'GET',
    path: '/{path*}',
    handler: function (request, h) {
      if (request.url.path.indexOf('uploads/') >= 0) {
        return h.file(`${request.params.path}`);
      } else {
        Logger.info(`!! Some one is trying to discover project ${process.env.PROJECT_NAME} using ${request.url.path}`);
        bot.sendMessage(chatId, `!! Some one is trying to discover project ${process.env.PROJECT_NAME} using ${request.url.path}`);
        return h.redirect(`https://google.com`);
      }
    },
  },
  //Upload APIs
  { method: 'POST', path: '/Upload/uploadMediaFile', config: Upload.uploadMediaFile },
  {
    method: 'GET',
    path: '/downloadApp',
    handler: function (request, h) {
      return h.redirect('https://dl.trumios.com/temp/index.php?hash=Wm50Q2NvbS50b3JpdGkuem50Yw==');
    },
  },

  { method: 'POST', path: '/Upload/uploadUserAvatar', config: Upload.uploadUserAvatar },

  {
    method: 'GET', //This API use to load QRCode of user
    path: '/images/{filename}',
    handler: function (request, h) {
      return h.file(`images/${request.params.filename}`);
    },
  },
  //download Excel
  {
    method: 'GET',
    path: '/uploads/exportExcel/{filename}',
    handler: function (request, h) {
      return h.file(`uploads/exportExcel/${request.params.filename}`);
    },
  },

  /****************PAYMENT MODULES ****************/
];

APIs = APIs.concat(require('../API/Maintain/route'));
APIs = APIs.concat(require('../API/AppUsers/route'));
APIs = APIs.concat(require('../API/AppUserConversation/route'));
APIs = APIs.concat(require('../API/AppUserMembership/route'));
APIs = APIs.concat(require('../API/AppUserMission/route'));
APIs = APIs.concat(require('../API/GameInfo/route'));
APIs = APIs.concat(require('../API/GamePlayRoom/route'));
APIs = APIs.concat(require('../API/AppUserGamePlayRoom/route'));
APIs = APIs.concat(require('../API/GamePlayRecords/route'));
APIs = APIs.concat(require('../API/GameRecord/route'));
APIs = APIs.concat(require('../API/CustomerMessage/route'));
APIs = APIs.concat(require('../API/LeaderBoard/router'));
APIs = APIs.concat(require('../API/OTPMessage/router'));
APIs = APIs.concat(require('../API/Wallet/route'));
APIs = APIs.concat(require('../API/WalletRecord/route'));

APIs = APIs.concat(require('../API/PaymentBonusTransaction/route'));
APIs = APIs.concat(require('../API/PaymentDepositTransaction/route'));
APIs = APIs.concat(require('../API/PaymentMethod/route'));
APIs = APIs.concat(require('../API/PaymentWithdrawTransaction/route'));
APIs = APIs.concat(require('../API/SunpayWebhook/route'));
APIs = APIs.concat(require('../API/Staff/route'));
APIs = APIs.concat(require('../API/StaffPermission/route'));
APIs = APIs.concat(require('../API/StaffRole/route'));
APIs = APIs.concat(require('../API/Statistical/route'));
APIs = APIs.concat(require('../API/SystemConfigurations/route'));
APIs = APIs.concat(require('../API/AppUserExperts/route'));
APIs = APIs.concat(require('../API/SystemAppChangedLog/route'));

module.exports = APIs;
