import { Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { USDC } from '../../constants';
import { temporaryReply } from '../../replies';
import { Markup } from 'telegraf';
import { backButton } from '../../keyboard/backButton';

export const createOrderUSDCScene = new Scenes.BaseScene<DCAContext>(
  'createorder_usdc'
);

createOrderUSDCScene.enter(async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAddress = USDC;
  ctx.session.orderToCreate.isNativeETH = false;

  await temporaryReply(
    ctx,
    'Please enter USDC amount to deposit (up to 6 decimals):',
    Markup.inlineKeyboard([backButton('createorder_back')])
  );
});

createOrderUSDCScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAmount = undefined;
  ctx.session.orderToCreate.isNativeETH = undefined;
  ctx.session.orderToCreate.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder');
});

// hears any number with up to 6 decimals
createOrderUSDCScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_desiredtoken');
});
