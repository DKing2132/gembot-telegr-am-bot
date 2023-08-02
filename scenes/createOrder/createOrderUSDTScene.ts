import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { USDT } from '../../constants';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';

export const createOrderUSDTScene = new Scenes.BaseScene<DCAContext>(
  'createorder_usdt'
);

createOrderUSDTScene.enter(async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAddress = USDT;
  ctx.session.orderToCreate.isNativeETH = false;

  await temporaryReply(
    ctx,
    'Please enter USDT amount to deposit (up to 6 decimals):',
    Markup.inlineKeyboard([backButton('createorder_back')])
  );
});

createOrderUSDTScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAmount = undefined;
  ctx.session.orderToCreate.isNativeETH = undefined;
  ctx.session.orderToCreate.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder');
});

// hears any number with up to 6 decimals
createOrderUSDTScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_desiredtoken');
});
