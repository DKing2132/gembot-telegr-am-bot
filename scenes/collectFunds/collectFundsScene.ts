import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { DAI, USDC, USDT, WETH, prisma } from '../../constants';
import { temporaryHTMLReply } from '../../replies';
import {
  generateCollectFundsHTML,
  generateCollectFundsLinkWalletHTML,
} from '../../html';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { startMenu } from '../../menu/startMenu';
import { backButton } from '../../keyboard/backButton';

export const collectFundsScene = new Scenes.BaseScene<DCAContext>(
  'collectfunds'
);

collectFundsScene.enter(async (ctx) => {
  ctx.session.collectFunds = {};
  
  const link = await prisma.link.findUnique({
    where: {
      userId: ctx.from!.id.toString(),
    },
  });

  if (!link) {
    await temporaryHTMLReply(
      ctx,
      generateCollectFundsLinkWalletHTML(),
      Markup.inlineKeyboard([backToMenuButton('collectfunds_back_to_menu')])
    );
  } else {
    await temporaryHTMLReply(
      ctx,
      generateCollectFundsHTML(),
      Markup.inlineKeyboard([
        [
          Markup.button.callback('ETH', 'collectfunds_with_eth'),
          Markup.button.callback('USDC', 'collectfunds_with_usdc'),
        ],
        [
          Markup.button.callback('DAI', 'collectfunds_with_dai'),
          Markup.button.callback('USDT', 'collectfunds_with_usdt'),
        ],
        [backButton('collectfunds_back')],
      ])
    );
  }
});

collectFundsScene.action('collectfunds_back_to_menu', async (ctx) => {
  ctx.session.collectFunds = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

collectFundsScene.action('collectfunds_back', async (ctx) => {
  ctx.session.collectFunds = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

// hears any string starting with 0x up to 75 chars long
collectFundsScene.hears(/^0x[0-9a-fA-F]{40}$/, async (ctx) => {
  ctx.session.collectFunds.tokenToWithdrawAddress = ctx.message.text;
  ctx.session.collectFunds.isNativeETH = false;

  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds_amount');
});

collectFundsScene.action('collectfunds_with_eth', async (ctx) => {
  ctx.session.collectFunds.tokenToWithdrawAddress = WETH;
  ctx.session.collectFunds.isNativeETH = true;

  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds_amount');
});

collectFundsScene.action('collectfunds_with_usdc', async (ctx) => {
  ctx.session.collectFunds.tokenToWithdrawAddress = USDC;
  ctx.session.collectFunds.isNativeETH = false;

  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds_amount');
});

collectFundsScene.action('collectfunds_with_dai', async (ctx) => {
  ctx.session.collectFunds.tokenToWithdrawAddress = DAI;
  ctx.session.collectFunds.isNativeETH = false;

  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds_amount');
});

collectFundsScene.action('collectfunds_with_usdt', async (ctx) => {
  ctx.session.collectFunds.tokenToWithdrawAddress = USDT;
  ctx.session.collectFunds.isNativeETH = false;

  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds_amount');
});
