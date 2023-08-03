import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';
import {
  confirmYourOrderHTML,
  orderCreationFailedHTML,
  orderWasCreatedHTML,
} from '../../html';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { order } from '../../routes';
import { OrderResponse } from '../../types/responses/OrderResponse';
import { ErrorMessage } from '../../types/responses/ErrorMessage';
import { temporaryHTMLReply } from '../../replies';
import { fetchWithTimeout } from '../../network';

export const createOrderConfirmScene = new Scenes.BaseScene<DCAContext>(
  'createorder_confirm'
);

createOrderConfirmScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    await confirmYourOrderHTML(ctx.session.orderToCreate),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Confirm', 'createorder_confirm'),
        Markup.button.callback('Cancel', 'createorder_cancel'),
      ],
      [backButton('createorder_back')],
    ])
  );
});

createOrderConfirmScene.action('createorder_back', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('createorder_wallet');
});

createOrderConfirmScene.action('createorder_confirm', async (ctx) => {
  try {
    const response = await fetchWithTimeout(`${process.env.API_URL}${order}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'genesis-bot-user-id': ctx.from!.id.toString(),
      },
      body: JSON.stringify(ctx.session.orderToCreate),
    });

    if (response.ok) {
      const orderResponse: OrderResponse = await response.json();
      console.log(orderResponse);
      await temporaryHTMLReply(
        ctx,
        orderWasCreatedHTML(),
        Markup.inlineKeyboard([backToMenuButton('createorder_back_to_menu')])
      );
    } else {
      const error: ErrorMessage = await response.json();
      await temporaryHTMLReply(
        ctx,
        orderCreationFailedHTML(error.message),
        Markup.inlineKeyboard([
          backToMenuButton('createorder_back_to_menu'),
          backButton('createorder_back'),
        ])
      );
    }
  } catch (e) {
    await temporaryHTMLReply(
      ctx,
      orderCreationFailedHTML('Unknown error.'),
      Markup.inlineKeyboard([
        backToMenuButton('createorder_back_to_menu'),
        backButton('createorder_back'),
      ])
    );
  }
});

createOrderConfirmScene.action('createorder_cancel', async (ctx) => {
  ctx.session.orderToCreate = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

createOrderConfirmScene.action('createorder_back_to_menu', async (ctx) => {
  ctx.session.orderToCreate = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});