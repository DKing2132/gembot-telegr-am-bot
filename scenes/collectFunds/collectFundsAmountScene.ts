import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';

export const collectFundsAmountScene = new Scenes.BaseScene<DCAContext>(
  'collectfunds_amount'
);

collectFundsAmountScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    'Please enter the amount of funds to collect:',
    Markup.inlineKeyboard([backButton('collectfunds_back')])
  );
});

collectFundsAmountScene.action('collectfunds_back', async (ctx) => {
  ctx.session.collectFunds.tokenToWithdrawAmount = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds');
});

// hears any number with any number of decimals
collectFundsAmountScene.hears(/^\d+(\.\d+)?$/, async (ctx) => {
  ctx.session.collectFunds.tokenToWithdrawAmount = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds_wallet');
});
