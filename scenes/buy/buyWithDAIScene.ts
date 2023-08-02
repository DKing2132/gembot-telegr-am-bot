import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { DAI } from '../../constants';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';

export const buyWithDAIScene = new Scenes.BaseScene<DCAContext>('buy_with_dai');

buyWithDAIScene.enter(async (ctx) => {
  ctx.session.buyOrder.depositedTokenAddress = DAI;
  ctx.session.buyOrder.isNativeETH = false;

  await temporaryReply(
    ctx,
    'Please enter DAI amount to deposit (up to 6 decimals):',
    Markup.inlineKeyboard([backButton('buy_back')])
  );
});

buyWithDAIScene.action('buy_back', async (ctx) => {
  ctx.session.buyOrder.depositedTokenAmount = undefined;
  ctx.session.buyOrder.isNativeETH = undefined;
  ctx.session.buyOrder.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('buy');
});

buyWithDAIScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  ctx.session.buyOrder.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('buy_desiredtoken');
});
