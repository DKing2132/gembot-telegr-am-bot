import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';

export const updateOrderSelectFieldScene = new Scenes.BaseScene<DCAContext>(
  'updateorder_selectfield'
);

updateOrderSelectFieldScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    'Please select a field to update:',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Desired Token', 'desired_token'),
        Markup.button.callback(
          'Deposited Token Amount',
          'deposited_token_amount'
        ),
      ],
      [
        Markup.button.callback('Unit of Time', 'unit_of_time'),
        Markup.button.callback('Frequency', 'frequency'),
      ],
      [backButton('updateorder_selectfield_back')],
    ])
  );
});

updateOrderSelectFieldScene.action(
  'updateorder_selectfield_back',
  async (ctx) => {
    ctx.session.orderToUpdate.field = undefined;

    await ctx.scene.leave();
    await ctx.scene.enter('updateorder');
  }
);

updateOrderSelectFieldScene.action('desired_token', async (ctx) => {
  ctx.session.orderToUpdate.field = 'desiredToken';

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_value');
});

updateOrderSelectFieldScene.action('deposited_token_amount', async (ctx) => {
  ctx.session.orderToUpdate.field = 'depositedTokenAmount';

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_value');
});

updateOrderSelectFieldScene.action('unit_of_time', async (ctx) => {
  ctx.session.orderToUpdate.field = 'unitOfTime';

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_value');
});

updateOrderSelectFieldScene.action('frequency', async (ctx) => {
  ctx.session.orderToUpdate.field = 'frequency';

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_value');
});
