import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { USDT } from '../../constants';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';

export const buyWithUSDTScene = new Scenes.BaseScene<DCAContext>(
  'buy_with_usdt'
);

buyWithUSDTScene.enter(async (ctx) => {
  ctx.session.buyOrder.depositedTokenAddress = USDT;
  ctx.session.buyOrder.isNativeETH = false;

  await temporaryReply(
    ctx,
    'Please enter USDT amount to deposit (up to 6 decimals):',
    Markup.inlineKeyboard([backButton('buy_back')])
  );
});

buyWithUSDTScene.action('buy_back', async (ctx) => {
  ctx.session.buyOrder.depositedTokenAmount = undefined;
  ctx.session.buyOrder.isNativeETH = undefined;
  ctx.session.buyOrder.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('buy');
});

// hears any number with up to 6 decimals
buyWithUSDTScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  ctx.session.buyOrder.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('buy_desiredtoken');
});
