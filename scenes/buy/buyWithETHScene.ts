import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryReply } from '../../replies';
import { WETH } from '../../constants';

export const buyWithETHScene = new Scenes.BaseScene<DCAContext>('buy_with_eth');

buyWithETHScene.enter(async (ctx) => {
  ctx.session.buyOrder.depositedTokenAddress = WETH;
  ctx.session.buyOrder.isNativeETH = true;

  await temporaryReply(
    ctx,
    'Please enter ETH amount you would like to use (up to 6 decimals):',
    Markup.inlineKeyboard([[Markup.button.callback('Back', 'buy_back')]])
  );
});

buyWithETHScene.action('buy_back', async (ctx) => {
  ctx.session.buyOrder.depositedTokenAmount = undefined;
  ctx.session.buyOrder.isNativeETH = undefined;
  ctx.session.buyOrder.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('buy');
});

// hears any number with up to 6 decimals
buyWithETHScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  ctx.session.buyOrder.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('buy_desiredtoken');
});
