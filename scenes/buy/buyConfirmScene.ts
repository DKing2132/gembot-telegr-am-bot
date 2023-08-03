import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import {
  generateBuyConfirmHTML,
  generateBuyFailedHTML,
  generateBuySuccessHTML,
  generatePleaseWaitHTML,
} from '../../html';
import { backButton } from '../../keyboard/backButton';
import { buy, trackJob } from '../../routes';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { ErrorMessage } from '../../types/responses/ErrorMessage';
import { startMenu } from '../../menu/startMenu';
import { JobResponse } from '../../types/responses/JobResponse';
import { JobStatusResponse } from '../../types/responses/JobStatusResponse';
import { fetchWithTimeout } from '../../network';

export const buyConfirmScene = new Scenes.BaseScene<DCAContext>('buy_confirm');

buyConfirmScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    await generateBuyConfirmHTML(ctx.session.buyOrder),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Confirm', 'buy_confirm'),
        Markup.button.callback('Cancel', 'buy_cancel'),
      ],
      [backButton('buy_back')],
    ])
  );
});

buyConfirmScene.action('buy_back', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('buy_wallet');
});

buyConfirmScene.action('buy_confirm', async (ctx) => {
  await temporaryHTMLReply(ctx, generatePleaseWaitHTML());
  try {
    const response = await fetchWithTimeout(`${process.env.API_URL}${buy}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'genesis-bot-user-id': ctx.from!.id.toString(),
      },
      body: JSON.stringify(ctx.session.buyOrder),
    });

    if (response.ok) {
      const buyResponse: JobResponse = await response.json();
      const timer = setInterval(async () => {
        console.log('polling for job status');
        try {
          const jobResponse = await fetchWithTimeout(
            `${process.env.API_URL}${trackJob}?id=${buyResponse.message}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (!jobResponse.ok) {
            const error: ErrorMessage = await jobResponse.json();
            await temporaryHTMLReply(
              ctx,
              generateBuyFailedHTML(error.message),
              Markup.inlineKeyboard([
                backToMenuButton('buy_back_to_menu'),
                backButton('buy_back'),
              ])
            );
            clearInterval(timer);
            return;
          }

          const jobStatus: JobStatusResponse = await jobResponse.json();
          if (jobStatus.status === 'SUCCESS') {
            console.log('job status is success');
            await temporaryHTMLReply(
              ctx,
              generateBuySuccessHTML(jobStatus.transactionHash!),
              Markup.inlineKeyboard([backToMenuButton('buy_back_to_menu')])
            );
            clearInterval(timer);
          } else if (jobStatus.status === 'FAILED') {
            console.log('job status is failed');
            await temporaryHTMLReply(
              ctx,
              generateBuyFailedHTML(jobStatus.message),
              Markup.inlineKeyboard([
                backToMenuButton('buy_back_to_menu'),
                backButton('buy_back'),
              ])
            );
            clearInterval(timer);
          } else {
            console.log('job status is still pending');
          }
        } catch (error) {
          console.log(error);
          await temporaryHTMLReply(
            ctx,
            generateBuyFailedHTML('Unknown error'),
            Markup.inlineKeyboard([
              backToMenuButton('buy_back_to_menu'),
              backButton('buy_back'),
            ])
          );
          clearInterval(timer);
        }
      }, 2000);
    } else {
      const error: ErrorMessage = await response.json();
      await temporaryHTMLReply(
        ctx,
        generateBuyFailedHTML(error.message),
        Markup.inlineKeyboard([
          backToMenuButton('buy_back_to_menu'),
          backButton('buy_back'),
        ])
      );
    }
  } catch (error) {
    console.log(error);
    await temporaryHTMLReply(
      ctx,
      generateBuyFailedHTML('Unknown error'),
      Markup.inlineKeyboard([
        backToMenuButton('buy_back_to_menu'),
        backButton('buy_back'),
      ])
    );
  }
});

buyConfirmScene.action('buy_cancel', async (ctx) => {
  ctx.session.buyOrder = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

buyConfirmScene.action('buy_back_to_menu', async (ctx) => {
  ctx.session.buyOrder = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});
