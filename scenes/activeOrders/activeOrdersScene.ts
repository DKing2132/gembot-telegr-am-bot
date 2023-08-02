import { Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { Markup } from 'telegraf';
import { temporaryHTMLReply } from '../../replies';
import {
  generateActiveOrdersHTML,
  generateFailedGetActiveOrdersHTML,
} from '../../html';
import { order } from '../../routes';
import { GetAllOrdersResponse } from '../../types/responses/GetAllOrdersResponse';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { ErrorMessage } from '../../types/responses/ErrorMessage';
import { startMenu } from '../../menu/startMenu';

export const activeOrdersScene = new Scenes.BaseScene<DCAContext>(
  'activeorders'
);

activeOrdersScene.enter(async (ctx) => {
  try {
    const response = await fetch(`${process.env.API_URL}${order}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'genesis-bot-user-id': ctx.from!.id.toString(),
      },
    });

    if (response.ok) {
      const orders: GetAllOrdersResponse = await response.json();
      console.log(orders);
      await temporaryHTMLReply(
        ctx,
        await generateActiveOrdersHTML(orders),
        Markup.inlineKeyboard([backToMenuButton('activeorders_back_to_menu')])
      );
    } else {
      const error: ErrorMessage = await response.json();
      console.log(error);
      await temporaryHTMLReply(
        ctx,
        generateFailedGetActiveOrdersHTML(error.message),
        Markup.inlineKeyboard([backToMenuButton('activeorders_back_to_menu')])
      );
    }
  } catch (error) {
    console.log(error);
    await temporaryHTMLReply(
      ctx,
      generateFailedGetActiveOrdersHTML('Unknown error.'),
      Markup.inlineKeyboard([backToMenuButton('createorder_back_to_menu')])
    );
  }
});

activeOrdersScene.action('activeorders_back_to_menu', async (ctx) => {
  await ctx.scene.leave();
  await startMenu(ctx);
});
