import { Markup, Scenes, Telegraf, session } from 'telegraf';
import 'dotenv/config';
import { DCAContext } from './context/DCAContext';
import { createOrderDesiredTokenScene } from './scenes/createOrder/createOrderDesiredTokenScene';
import { createOrderScene } from './scenes/createOrder/createOrderScene';
import { startMenu } from './menu/startMenu';
import { domain, nodeEnv, token } from './constants';
import { createOrderETHScene } from './scenes/createOrder/createOrderETHScene';
import { createOrderUnitOfTimeScene } from './scenes/createOrder/createOrderUnitOfTimeScene';
import { createOrderFrequencyScene } from './scenes/createOrder/createOrderFrequencyScene';
import { createOrderConfirmScene } from './scenes/createOrder/createOrderConfirmScene';
import { collectFundsScene } from './scenes/collectFunds/collectFundsScene';
import { updateOrderScene } from './scenes/updateOrder/updateOrderScene';
import { deleteOrderScene } from './scenes/deleteOrder/deleteOrderScene';
import { activeOrdersScene } from './scenes/activeOrders/activeOrdersScene';
import { settingsScene } from './scenes/settings/settingsScene';
import { createOrderWalletScene } from './scenes/createOrder/createOrderWalletScene';
import { errorEncounteredHTML } from './html';
import { backToMenuButton } from './keyboard/backToMenuButton';
import { temporaryHTMLReply } from './replies';
import { deleteOrderConfirmScene } from './scenes/deleteOrder/deleteOrderConfirmScene';
import { createOrderUSDCScene } from './scenes/createOrder/createOrderUSDCScene';
import { createOrderDAIScene } from './scenes/createOrder/createOrderDAIScene';
import { createOrderUSDTScene } from './scenes/createOrder/createOrderUSDTScene';
import { updateOrderSelectFieldScene } from './scenes/updateOrder/updateOrderSelectFieldScene';
import { updateOrderValueScene } from './scenes/updateOrder/updateOrderValueScene';
import { updateOrderConfirmScene } from './scenes/updateOrder/updateOrderConfirmScene';
import { buyScene } from './scenes/buy/buyScene';
import { buyWithETHScene } from './scenes/buy/buyWithETHScene';
import { buyDesiredToken } from './scenes/buy/buyDesiredTokenScene';
import { buyWalletScene } from './scenes/buy/buyWalletScene';
import { buyConfirmScene } from './scenes/buy/buyConfirmScene';
import { buyWithUSDCScene } from './scenes/buy/buyWithUSDCScene';
import { buyWithDAIScene } from './scenes/buy/buyWithDAIScene';
import { buyWithUSDTScene } from './scenes/buy/buyWithUSDTScene';
import { sellScene } from './scenes/sell/sellScene';
import { sellWithTokenScene } from './scenes/sell/sellWithTokenScene';
import { sellDesiredTokenScene } from './scenes/sell/sellDesiredTokenScene';
import { sellWalletScene } from './scenes/sell/sellWalletScene';
import { sellConfirmScene } from './scenes/sell/sellConfirmScene';
import { collectFundsAmountScene } from './scenes/collectFunds/collectFundsAmountScene';
import { collectFundsWalletScene } from './scenes/collectFunds/collectFundsWalletScene';
import { collectFundsConfirmScene } from './scenes/collectFunds/collectFundsConfirm';
import { settingsLinkWalletScene } from './scenes/settings/settingsLinkWalletScene';
import { settingsLinkWalletConfirmScene } from './scenes/settings/settingsLinkWalletConfirmScene';
import { orderStatusScene } from './scenes/orderStatus/orderStatusScene';

const bot = new Telegraf<DCAContext>(token);
bot.telegram.setMyCommands([
  {
    command: 'start',
    description: 'Start the experience',
  },
]);
const dcaStage = new Scenes.Stage<DCAContext>(
  [
    createOrderScene,
    createOrderETHScene,
    createOrderUSDCScene,
    createOrderDAIScene,
    createOrderUSDTScene,
    createOrderDesiredTokenScene,
    createOrderUnitOfTimeScene,
    createOrderFrequencyScene,
    createOrderWalletScene,
    createOrderConfirmScene,
    collectFundsScene,
    collectFundsAmountScene,
    collectFundsWalletScene,
    collectFundsConfirmScene,
    buyScene,
    buyWithETHScene,
    buyWithUSDCScene,
    buyWithDAIScene,
    buyWithUSDTScene,
    buyDesiredToken,
    buyWalletScene,
    buyConfirmScene,
    sellScene,
    sellWithTokenScene,
    sellDesiredTokenScene,
    sellWalletScene,
    sellConfirmScene,
    updateOrderScene,
    updateOrderSelectFieldScene,
    updateOrderValueScene,
    updateOrderConfirmScene,
    deleteOrderScene,
    deleteOrderConfirmScene,
    activeOrdersScene,
    settingsScene,
    settingsLinkWalletScene,
    settingsLinkWalletConfirmScene,
    orderStatusScene,
  ],
  {
    ttl: 1000000,
  }
);

bot.use(session());
bot.use(dcaStage.middleware());
bot.use(Telegraf.log());
bot.use((ctx, next) => {
  ctx.session.orderToCreate ??= {};
  return next();
});
bot.catch(async (err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  await temporaryHTMLReply(
    ctx,
    errorEncounteredHTML('Unkown error, please contact if it persists.'),
    Markup.inlineKeyboard([backToMenuButton('start')])
  );
});

bot.start(async (ctx) => {
  await startMenu(ctx);
});
bot.action('start', async (ctx) => {
  await startMenu(ctx);
});

bot.action('createorder', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('createorder');
});

bot.action('collectfunds', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds');
});

bot.action('buy', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('buy');
});

bot.action('sell', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('sell');
});

bot.action('updateorder', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('updateorder');
});

bot.action('deleteorder', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('deleteorder');
});

bot.action('activeorders', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('activeorders');
});

bot.action('settings', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('settings');
});

bot.action('orderstatus', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('orderstatus');
});

if (nodeEnv === 'production') {
  bot.launch({
    webhook: {
      domain: domain,
      port: Number(process.env.PORT || 5000),
    },
  });
} else {
  bot.launch();
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
