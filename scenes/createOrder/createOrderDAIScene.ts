import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { DAI } from '../../constants';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';

export const createOrderDAIScene = new Scenes.BaseScene<DCAContext>(
  'createorder_dai'
);

createOrderDAIScene.enter(async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAddress = DAI;
  ctx.session.orderToCreate.isNativeETH = false;

  await temporaryReply(
    ctx,
    'Please enter DAI amount to deposit (up to 6 decimals):',
    Markup.inlineKeyboard([backButton('createorder_back')])
  );
});

createOrderDAIScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAmount = undefined;
  ctx.session.orderToCreate.isNativeETH = undefined;
  ctx.session.orderToCreate.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder');
});

// hears any number with up to 6 decimals
createOrderDAIScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_desiredtoken');
});
