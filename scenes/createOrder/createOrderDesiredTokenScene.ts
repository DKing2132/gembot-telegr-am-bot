import { Markup, Scenes } from 'telegraf';
import { backButton } from '../../keyboard/backButton';
import { DCAContext } from '../../context/DCAContext';
import { DAI, USDC, USDT, WETH } from '../../constants';
import { temporaryReply } from '../../replies';

export const createOrderDesiredTokenScene = new Scenes.BaseScene<DCAContext>(
  'createorder_desiredtoken'
);
createOrderDesiredTokenScene.enter(async (ctx) => {
  const buttonsKeyboard = [backButton('createorder_back')];

  if (ctx.session.orderToCreate.depositedTokenAddress !== WETH) {
    buttonsKeyboard.unshift(
      Markup.button.callback('ETH', 'createorder_eth_desired')
    );
  }

  await temporaryReply(
    ctx,
    'Please enter address of or select desired token:',
    Markup.inlineKeyboard(buttonsKeyboard)
  );
});

createOrderDesiredTokenScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate.desiredTokenAddress = undefined;
  ctx.session.orderToCreate.isNativeETH = undefined;

  await ctx.scene.leave();
  if (ctx.session.orderToCreate.depositedTokenAddress === WETH) {
    await ctx.scene.enter('createorder_eth');
  } else if (ctx.session.orderToCreate.depositedTokenAddress === USDC) {
    await ctx.scene.enter('createorder_usdc');
  } else if (ctx.session.orderToCreate.depositedTokenAddress === DAI) {
    await ctx.scene.enter('createorder_dai');
  } else if (ctx.session.orderToCreate.depositedTokenAddress === USDT) {
    await ctx.scene.enter('createorder_usdt');
  } else {
    await ctx.scene.enter('createorder');
  }
});

// hears any string starting with 0x up to 75 chars long
createOrderDesiredTokenScene.hears(/^0x[0-9a-fA-F]{40}$/, async (ctx) => {
  ctx.session.orderToCreate.desiredTokenAddress = ctx.message.text;

  await ctx.scene.leave();

  if (!ctx.session.orderToCreate.isLimitOrder) {
    await ctx.scene.enter('createorder_unit_of_time');
  } else {
    await ctx.scene.enter('createorder_market_cap');
  }
});

createOrderDesiredTokenScene.action('createorder_eth_desired', async (ctx) => {
  ctx.session.orderToCreate.desiredTokenAddress = WETH;
  ctx.session.orderToCreate.isNativeETH = true;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_unit_of_time');
});
