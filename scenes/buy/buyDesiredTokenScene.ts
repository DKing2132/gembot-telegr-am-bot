import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { backButton } from '../../keyboard/backButton';
import { DAI, USDC, USDT, WETH } from '../../constants';
import { temporaryReply } from '../../replies';

export const buyDesiredToken = new Scenes.BaseScene<DCAContext>(
  'buy_desiredtoken'
);

buyDesiredToken.enter(async (ctx) => {
  const buttonsKeyboard = [backButton('buy_back')];

  if (ctx.session.buyOrder.depositedTokenAddress !== WETH) {
    buttonsKeyboard.unshift(Markup.button.callback('ETH', 'buy_eth_desired'));
  }

  await temporaryReply(
    ctx,
    'Please enter address of or select desired token',
    Markup.inlineKeyboard(buttonsKeyboard)
  );
});

buyDesiredToken.action('buy_back', async (ctx) => {
  ctx.session.buyOrder.desiredTokenAddress = undefined;
  ctx.session.buyOrder.isNativeETH = undefined;

  await ctx.scene.leave();
  if (ctx.session.buyOrder.depositedTokenAddress === WETH) {
    await ctx.scene.enter('buy_with_eth');
  } else if (ctx.session.buyOrder.depositedTokenAddress === USDC) {
    await ctx.scene.enter('buy_with_usdc');
  } else if (ctx.session.buyOrder.depositedTokenAddress === DAI) {
    await ctx.scene.enter('buy_with_dai');
  } else if (ctx.session.buyOrder.depositedTokenAddress === USDT) {
    await ctx.scene.enter('buy_with_usdt');
  } else {
    await ctx.scene.enter('buy');
  }
});

// hears any string starting with 0x up to 75 chars long
buyDesiredToken.hears(/^0x[0-9a-fA-F]{40}$/, async (ctx) => {
  ctx.session.buyOrder.desiredTokenAddress = ctx.message.text;

  await ctx.scene.leave();
  await ctx.scene.enter('buy_wallet');
});

buyDesiredToken.action('buy_eth_desired', async (ctx) => {
  ctx.session.buyOrder.desiredTokenAddress = WETH;
  ctx.session.buyOrder.isNativeETH = true;

  await ctx.scene.leave();
  await ctx.scene.enter('buy_wallet');
});
