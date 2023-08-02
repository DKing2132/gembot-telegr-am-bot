import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { WETH } from '../../constants';
import { backButton } from '../../keyboard/backButton';
import { temporaryReply } from '../../replies';

export const createOrderETHScene = new Scenes.BaseScene<DCAContext>(
  'createorder_eth'
);

createOrderETHScene.enter(async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAddress = WETH;
  ctx.session.orderToCreate.isNativeETH = true;

  await temporaryReply(
    ctx,
    'Please enter ETH amount to deposit (up to 6 decimals):',
    Markup.inlineKeyboard([backButton('createorder_back')])
  );
});

createOrderETHScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAmount = undefined;
  ctx.session.orderToCreate.isNativeETH = undefined;
  ctx.session.orderToCreate.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder');
});

// hears any number with up to 6 decimals
createOrderETHScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  ctx.session.orderToCreate.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_desiredtoken');
});
