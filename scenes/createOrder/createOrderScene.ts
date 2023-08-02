import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { generateCreateOrderHTML } from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';
import { temporaryHTMLReply } from '../../replies';

export const createOrderScene = new Scenes.BaseScene<DCAContext>('createorder');

createOrderScene.enter(async (ctx) => {
  ctx.session.orderToCreate = {};

  await temporaryHTMLReply(
    ctx,
    generateCreateOrderHTML(),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('ETH', 'createorder_eth'),
        Markup.button.callback('USDC', 'createorder_usdc'),
      ],
      [
        Markup.button.callback('DAI', 'createorder_dai'),
        Markup.button.callback('USDT', 'createorder_usdt'),
      ],
      [backButton('createorder_back')],
    ])
  );
});
createOrderScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

createOrderScene.action('createorder_eth', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('createorder_eth');
});

createOrderScene.action('createorder_usdc', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('createorder_usdc');
});

createOrderScene.action('createorder_dai', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('createorder_dai');
});

createOrderScene.action('createorder_usdt', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('createorder_usdt');
});
