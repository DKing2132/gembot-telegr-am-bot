import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';

export const sellWithTokenScene = new Scenes.BaseScene<DCAContext>(
  'sell_with_token'
);

sellWithTokenScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    'Please enter token amount to deposit (any number of decimals):',
    Markup.inlineKeyboard([backButton('sell_back')])
  );
});

sellWithTokenScene.action('sell_back', async (ctx) => {
  ctx.session.sellOrder.depositedTokenAmount = undefined;
  ctx.session.sellOrder.depositedTokenAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('sell');
});

// hears any number with any number of decimals
sellWithTokenScene.hears(/^\d+(\.\d+)?$/, async (ctx) => {
  ctx.session.sellOrder.depositedTokenAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('sell_desiredtoken');
});
