import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import {
  generateDeleteFailedHTML,
  generateDeleteOrderConfirmHTML,
  generateDeleteSuccessHTML,
} from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';
import { order } from '../../routes';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { ErrorMessage } from '../../types/responses/ErrorMessage';
import { fetchWithTimeout } from '../../network';

export const deleteOrderConfirmScene = new Scenes.BaseScene<DCAContext>(
  'deleteorder_confirm'
);

deleteOrderConfirmScene.enter(async (ctx) => {
  const orderID: string = ctx.session.orderToDelete;

  await temporaryHTMLReply(
    ctx,
    generateDeleteOrderConfirmHTML(orderID),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Confirm', 'deleteorder_confirm'),
        Markup.button.callback('Cancel', 'deleteorder_cancel'),
      ],
      [backButton('deleteorder_back')],
    ])
  );
});

deleteOrderConfirmScene.action('deleteorder_confirm', async (ctx) => {
  try {
    const response = await fetchWithTimeout(`${process.env.API_URL}${order}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'genesis-bot-user-id': ctx.from!.id.toString(),
      },
      body: JSON.stringify({ orderID: ctx.session.orderToDelete }),
    });

    if (response.ok) {
      await temporaryHTMLReply(
        ctx,
        generateDeleteSuccessHTML(),
        Markup.inlineKeyboard([backToMenuButton('deleteorder_back_to_menu')])
      );
    } else {
      const error: ErrorMessage = await response.json();
      await temporaryHTMLReply(
        ctx,
        generateDeleteFailedHTML(error.message),
        Markup.inlineKeyboard([backToMenuButton('deleteorder_back_to_menu')])
      );
    }
  } catch (error) {
    await temporaryHTMLReply(
      ctx,
      generateDeleteFailedHTML('Unknown error, please contact if it persists.'),
      Markup.inlineKeyboard([backToMenuButton('deleteorder_back_to_menu')])
    );
  }
});

deleteOrderConfirmScene.action('deleteorder_back', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('deleteorder');
});

deleteOrderConfirmScene.action('deleteorder_cancel', async (ctx) => {
  ctx.session.orderToDelete = "";

  await ctx.scene.leave();
  await startMenu(ctx);
});

deleteOrderConfirmScene.action('deleteorder_back_to_menu', async (ctx) => {
  ctx.session.orderToDelete = "";

  await ctx.scene.leave();
  await startMenu(ctx);
});
