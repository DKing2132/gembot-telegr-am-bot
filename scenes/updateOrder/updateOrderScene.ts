import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import { generateUpdateOrderHTML } from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';

export const updateOrderScene = new Scenes.BaseScene<DCAContext>('updateorder');

updateOrderScene.enter(async (ctx) => {
  ctx.session.orderToUpdate = {};

  await temporaryHTMLReply(
    ctx,
    generateUpdateOrderHTML(),
    Markup.inlineKeyboard([backButton('updateorder_back')])
  );
});

updateOrderScene.action('updateorder_back', async (ctx) => {
  ctx.session.orderToUpdate = {};

  await ctx.scene.leave();
  await startMenu(ctx);
});

// is valid guid
updateOrderScene.hears(
  /^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i,
  async (ctx) => {
    ctx.session.orderToUpdate.orderID = ctx.message.text;

    await ctx.scene.leave();
    await ctx.scene.enter('updateorder_selectfield');
  }
);
