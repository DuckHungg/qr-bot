const TelegramBot = require('node-telegram-bot-api');
const Jimp = require('jimp');
const QrCode = require('qrcode-reader');

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;

  try {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const fileLink = await bot.getFileLink(fileId);

    const image = await Jimp.read(fileLink);

    const qr = new QrCode();

    qr.callback = function (err, value) {
      if (err || !value) {
        bot.sendMessage(chatId, "KHONG_DOC_DUOC_QR");
        return;
      }

      const data = value.result;
      const match = data.match(/CK\.\d+/);
      const ck = match ? match[0] : data;

      bot.sendPhoto(chatId, fileLink, { caption: ck });
    };

    qr.decode(image.bitmap);

  } catch {
    bot.sendMessage(chatId, "LOI");
  }
});
