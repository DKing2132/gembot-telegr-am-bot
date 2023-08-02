import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import { generateSellDesiredTokenHTML } from '../../html';
import { backButton } from '../../keyboard/backButton';
import { DAI, USDC, USDT, WETH } from '../../constants';

export const sellDesiredTokenScene = new Scenes.BaseScene<DCAContext>(
  'sell_desiredtoken'
);

sellDesiredTokenScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    generateSellDesiredTokenHTML(),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('ETH', 'sell_desired_eth'),
        Markup.button.callback('USDC', 'sell_desired_usdc'),
      ],
      [
        Markup.button.callback('DAI', 'sell_desired_dai'),
        Markup.button.callback('USDT', 'sell_desired_usdt'),
      ],
      [backButton('sell_back')],
    ])
  );
});

sellDesiredTokenScene.action('sell_back', async (ctx) => {
  ctx.session.sellOrder.desiredTokenAddress = undefined;
  ctx.session.sellOrder.isNativeETH = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('sell_with_token');
});

sellDesiredTokenScene.action('sell_desired_eth', async (ctx) => {
  ctx.session.sellOrder.desiredTokenAddress = WETH;
  ctx.session.sellOrder.isNativeETH = true;

  await ctx.scene.leave();
  await ctx.scene.enter('sell_wallet');
});

sellDesiredTokenScene.action('sell_desired_usdc', async (ctx) => {
  ctx.session.sellOrder.desiredTokenAddress = USDC;
  ctx.session.sellOrder.isNativeETH = false;

  await ctx.scene.leave();
  await ctx.scene.enter('sell_wallet');
});

sellDesiredTokenScene.action('sell_desired_dai', async (ctx) => {
  ctx.session.sellOrder.desiredTokenAddress = DAI;
  ctx.session.sellOrder.isNativeETH = false;

  await ctx.scene.leave();
  await ctx.scene.enter('sell_wallet');
});

sellDesiredTokenScene.action('sell_desired_usdt', async (ctx) => {
  ctx.session.sellOrder.desiredTokenAddress = USDT;
  ctx.session.sellOrder.isNativeETH = false;

  await ctx.scene.leave();
  await ctx.scene.enter('sell_wallet');
});
