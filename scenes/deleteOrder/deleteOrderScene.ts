import { Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import { generateDeleteOrderHTML } from '../../html';
import { Markup } from 'telegraf';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';

export const deleteOrderScene = new Scenes.BaseScene<DCAContext>('deleteorder');

deleteOrderScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    generateDeleteOrderHTML(),
    Markup.inlineKeyboard([[backButton('deleteorder_back')]])
  );
});

deleteOrderScene.action('deleteorder_back', async (ctx) => {
  await ctx.scene.leave();
  await startMenu(ctx);
});

// is valid guid
deleteOrderScene.hears(
  /^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i,
  async (ctx) => {
    ctx.session.orderToDelete = ctx.message.text;

    await ctx.scene.leave();
    await ctx.scene.enter('deleteorder_confirm');
  }
);
