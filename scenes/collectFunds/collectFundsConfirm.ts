import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import {
  generateCollectFundsConfirmHTML,
  generateCollectFundsFailedHTML,
  generateCollectFundsSuccessHTML,
  generatePleaseWaitHTML,
} from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';
import { collect } from '../../routes';
import { TxResponse } from '../../types/responses/TxResponse';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { ErrorMessage } from '../../types/responses/ErrorMessage';

export const collectFundsConfirmScene = new Scenes.BaseScene<DCAContext>(
  'collectfunds_confirm'
);

collectFundsConfirmScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    await generateCollectFundsConfirmHTML(ctx.session.collectFunds),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Confirm', 'collectfunds_confirm'),
        Markup.button.callback('Cancel', 'collectfunds_cancel'),
      ],
      [backButton('collectfunds_back')],
    ])
  );
});

collectFundsConfirmScene.action('collectfunds_back', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds_wallet');
});

collectFundsConfirmScene.action('collectfunds_cancel', async (ctx) => {
  ctx.session.collectFunds = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

collectFundsConfirmScene.action('collectfunds_confirm', async (ctx) => {
  await temporaryHTMLReply(ctx, generatePleaseWaitHTML());
  try {
    const response = await fetch(`${process.env.API_URL}${collect}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'genesis-bot-user-id': ctx.from!.id.toString(),
      },
      body: JSON.stringify(ctx.session.collectFunds),
    });

    if (response.ok) {
      const collectFundsResponse: TxResponse = await response.json();
      console.log(collectFundsResponse);
      await temporaryHTMLReply(
        ctx,
        generateCollectFundsSuccessHTML(collectFundsResponse.transactionHash),
        Markup.inlineKeyboard([backToMenuButton('collectfunds_back_to_menu')])
      );
    } else {
      const error: ErrorMessage = await response.json();
      await temporaryHTMLReply(
        ctx,
        generateCollectFundsFailedHTML(error.message),
        Markup.inlineKeyboard([
          backToMenuButton('collectfunds_back_to_menu'),
          backButton('collectfunds_back'),
        ])
      );
    }
  } catch (error) {
    console.log(error);
    await temporaryHTMLReply(
      ctx,
      generateCollectFundsFailedHTML('Unknown error'),
      Markup.inlineKeyboard([
        backToMenuButton('collectfunds_back_to_menu'),
        backButton('collectfunds_back'),
      ])
    );
  }
});

collectFundsConfirmScene.action('collectfunds_back_to_menu', async (ctx) => {
  ctx.session.collectFunds = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});
