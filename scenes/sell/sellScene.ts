import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import { generateSellHTML } from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';

export const sellScene = new Scenes.BaseScene<DCAContext>('sell');

sellScene.enter(async (ctx) => {
  ctx.session.sellOrder = {};

  await temporaryHTMLReply(
    ctx,
    generateSellHTML(),
    Markup.inlineKeyboard([backButton('sell_back')])
  );
});

sellScene.action('sell_back', async (ctx) => {
  ctx.session.sellOrder = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

// hears any string starting with 0x up to 75 chars long
sellScene.hears(/^0x[0-9a-fA-F]{40}$/, async (ctx) => {
  ctx.session.sellOrder.depositedTokenAddress = ctx.message.text;

  await ctx.scene.leave();
  await ctx.scene.enter('sell_with_token');
});
