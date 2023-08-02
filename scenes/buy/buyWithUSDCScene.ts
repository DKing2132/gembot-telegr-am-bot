import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { USDC } from '../../constants';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';

export const buyWithUSDCScene = new Scenes.BaseScene<DCAContext>(
  'buy_with_usdc'
);

buyWithUSDCScene.enter(async (ctx) => {
  ctx.session.buyOrder.depositedTokenAddress = USDC;
  ctx.session.buyOrder.isNativeETH = false;

  await temporaryReply(
    ctx,
    'Please enter USDC amount to deposit (up to 6 decimals):',
    Markup.inlineKeyboard([backButton('buy_back')])
  );
});

buyWithUSDCScene.action('buy_back', async (ctx) => {
  ctx.session.buyOrder.depositedTokenAmount = undefined;
  ctx.session.buyOrder.isNativeETH = undefined;
  ctx.session.buyOrder.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('buy');
});

// hears any number with up to 6 decimals
buyWithUSDCScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  ctx.session.buyOrder.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('buy_desiredtoken');
});
