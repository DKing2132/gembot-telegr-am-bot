import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import {
  generatePleaseWaitHTML,
  generateSellConfirmHTML,
  generateSellFailedHTML,
  generateSellSuccessHTML,
} from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';
import { sell, trackJob } from '../../routes';
import { ErrorMessage } from '../../types/responses/ErrorMessage';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { JobResponse } from '../../types/responses/JobResponse';
import { JobStatusResponse } from '../../types/responses/JobStatusResponse';
import { fetchWithTimeout } from '../../network';

export const sellConfirmScene = new Scenes.BaseScene<DCAContext>(
  'sell_confirm'
);

sellConfirmScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    await generateSellConfirmHTML(ctx.session.sellOrder),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Confirm', 'sell_confirm'),
        Markup.button.callback('Cancel', 'sell_cancel'),
      ],
      [backButton('sell_back')],
    ])
  );
});

sellConfirmScene.action('sell_back', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('sell_wallet');
});

sellConfirmScene.action('sell_cancel', async (ctx) => {
  ctx.session.sellOrder = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

sellConfirmScene.action('sell_back_to_menu', async (ctx) => {
  ctx.session.sellOrder = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

sellConfirmScene.action('sell_confirm', async (ctx) => {
  await temporaryHTMLReply(ctx, generatePleaseWaitHTML());
  try {
    const response = await fetchWithTimeout(`${process.env.API_URL}${sell}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'genesis-bot-user-id': ctx.from!.id.toString(),
      },
      body: JSON.stringify(ctx.session.sellOrder),
    });

    if (response.ok) {
      const sellResponse: JobResponse = await response.json();

      const timer = setInterval(async () => {
        console.log('polling for job status');
        try {
          const jobResponse = await fetchWithTimeout(
            `${process.env.API_URL}${trackJob}?id=${sellResponse.message}`,
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
              generateSellFailedHTML(error.message),
              Markup.inlineKeyboard([
                backToMenuButton('sell_back_to_menu'),
                backButton('sell_back'),
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
              generateSellSuccessHTML(jobStatus.transactionHash!),
              Markup.inlineKeyboard([backToMenuButton('sell_back_to_menu')])
            );
            clearInterval(timer);
          } else if (jobStatus.status === 'FAILED') {
            console.log('job status is failed');
            await temporaryHTMLReply(
              ctx,
              generateSellSuccessHTML(jobStatus.message),
              Markup.inlineKeyboard([
                backToMenuButton('sell_back_to_menu'),
                backButton('sell_back'),
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
            generateSellFailedHTML('Unknown error'),
            Markup.inlineKeyboard([
              backToMenuButton('sell_back_to_menu'),
              backButton('sell_back'),
            ])
          );
          clearInterval(timer);
        }
      }, 2000);
    } else {
      const error: ErrorMessage = await response.json();
      await temporaryHTMLReply(
        ctx,
        generateSellFailedHTML(error.message),
        Markup.inlineKeyboard([
          backToMenuButton('sell_back_to_menu'),
          backButton('sell_back'),
        ])
      );
    }
  } catch (error) {
    console.log(error);
    await temporaryHTMLReply(
      ctx,
      generateSellFailedHTML('Unknown error.'),
      Markup.inlineKeyboard([
        backToMenuButton('sell_back_to_menu'),
        backButton('sell_back'),
      ])
    );
  }
});
