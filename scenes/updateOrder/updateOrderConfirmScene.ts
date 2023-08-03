import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import {
  generateUpdateOrderConfirmHTML,
  generateUpdateOrderCreatedSuccessfullyHTML,
  generateUpdateOrderFailedHTML,
} from '../../html';
import { order } from '../../routes';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { ErrorMessage } from '../../types/responses/ErrorMessage';
import { startMenu } from '../../menu/startMenu';
import { fetchWithTimeout } from '../../network';

export const updateOrderConfirmScene = new Scenes.BaseScene<DCAContext>(
  'updateorder_confirm'
);

updateOrderConfirmScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    await generateUpdateOrderConfirmHTML(ctx.session.orderToUpdate),
    Markup.inlineKeyboard([
      [Markup.button.callback('Confirm', 'updateorder_confirm')],
      [Markup.button.callback('Cancel', 'updateorder_cancel')],
    ])
  );
});

updateOrderConfirmScene.action('updateorder_back', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_value');
});

updateOrderConfirmScene.action('updateorder_confirm', async (ctx) => {
  try {
    const response = await fetchWithTimeout(`${process.env.API_URL}${order}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'genesis-bot-user-id': ctx.from!.id.toString(),
      },
      body: JSON.stringify(ctx.session.orderToUpdate),
    });

    if (response.ok) {
      await temporaryHTMLReply(
        ctx,
        generateUpdateOrderCreatedSuccessfullyHTML(),
        Markup.inlineKeyboard([backToMenuButton('updateorder_back_to_menu')])
      );
    } else {
      const error: ErrorMessage = await response.json();
      await temporaryHTMLReply(
        ctx,
        generateUpdateOrderFailedHTML(error.message),
        Markup.inlineKeyboard([backToMenuButton('updateorder_back_to_menu')])
      );
    }
  } catch (error) {
    await temporaryHTMLReply(
      ctx,
      generateUpdateOrderFailedHTML(
        'Unknown error, please contact if it persists.'
      ),
      Markup.inlineKeyboard([backToMenuButton('updateorder_back_to_menu')])
    );
  }
});

updateOrderConfirmScene.action('updateorder_cancel', async (ctx) => {
  ctx.session.orderToUpdate = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

updateOrderConfirmScene.action('updateorder_back_to_menu', async (ctx) => {
  ctx.session.orderToUpdate = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});
