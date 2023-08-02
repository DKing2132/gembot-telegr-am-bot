import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import { generateBuyHTML } from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';

export const buyScene = new Scenes.BaseScene<DCAContext>('buy');

buyScene.enter(async (ctx) => {
  ctx.session.buyOrder = {};

  await temporaryHTMLReply(
    ctx,
    generateBuyHTML(),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('ETH', 'buy_with_eth'),
        Markup.button.callback('USDC', 'buy_with_usdc'),
      ],
      [
        Markup.button.callback('DAI', 'buy_with_dai'),
        Markup.button.callback('USDT', 'buy_with_usdt'),
      ],
      [backButton('buy_back')],
    ])
  );
});

buyScene.action('buy_back', async (ctx) => {
  ctx.session.buyOrder = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

buyScene.action('buy_with_eth', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('buy_with_eth');
});

buyScene.action('buy_with_usdc', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('buy_with_usdc');
});

buyScene.action('buy_with_dai', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('buy_with_dai');
});

buyScene.action('buy_with_usdt', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('buy_with_usdt');
});
