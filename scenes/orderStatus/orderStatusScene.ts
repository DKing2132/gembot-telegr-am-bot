import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { startMenu } from '../../menu/startMenu';
import { fetchWithTimeout } from '../../network';
import { orderStatus } from '../../routes';
import { OrderStatusHistoryResponse } from '../../types/responses/OrderStatusHistoryResponse';
import { temporaryHTMLReply } from '../../replies';
import {
  generateFailedGetActiveOrdersHTML,
  generateOrderStatusesFailedHTML,
  generateOrderStatusesHTML,
} from '../../html';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { ErrorMessage } from '../../types/responses/ErrorMessage';

export const orderStatusScene = new Scenes.BaseScene<DCAContext>('orderstatus');

orderStatusScene.enter(async (ctx) => {
  try {
    const response = await fetchWithTimeout(
      `${process.env.API_URL}${orderStatus}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'genesis-bot-user-id': ctx.from!.id.toString(),
        },
      }
    );

    if (response.ok) {
      const orderStatuses: OrderStatusHistoryResponse = await response.json();
      console.log(orderStatuses);
      await temporaryHTMLReply(
        ctx,
        await generateOrderStatusesHTML(orderStatuses),
        Markup.inlineKeyboard([backToMenuButton('orderstatus_back_to_menu')])
      );
    } else {
      const error: ErrorMessage = await response.json();
      console.log(error);
      await temporaryHTMLReply(
        ctx,
        generateOrderStatusesFailedHTML(error.message),
        Markup.inlineKeyboard([backToMenuButton('orderstatus_back_to_menu')])
      );
    }
  } catch (error) {
    console.log(error);
    await temporaryHTMLReply(
      ctx,
      generateFailedGetActiveOrdersHTML('Unknown error.'),
      Markup.inlineKeyboard([backToMenuButton('orderstatus_back_to_menu')])
    );
  }
});

orderStatusScene.action('orderstatus_back_to_menu', async (ctx) => {
  await ctx.scene.leave();
  await startMenu(ctx);
});
