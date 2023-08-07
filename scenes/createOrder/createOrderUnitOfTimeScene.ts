import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { backButton } from '../../keyboard/backButton';
import { temporaryReply } from '../../replies';

export const createOrderUnitOfTimeScene = new Scenes.BaseScene<DCAContext>(
  'createorder_unit_of_time'
);

createOrderUnitOfTimeScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    'Please select how often you will like to execute buys?',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Hourly', 'createorder_hourly'),
        Markup.button.callback('Daily', 'createorder_daily'),
      ],
      [
        Markup.button.callback('Weekly', 'createorder_weekly'),
        Markup.button.callback('Monthly', 'createorder_monthly'),
      ],
      [backButton('createorder_back')],
    ])
  );
});

createOrderUnitOfTimeScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate.unitOfTime = undefined;

  await ctx.scene.leave();
  if (ctx.session.orderToCreate.isLimitOrder) {
    await ctx.scene.enter('createorder_market_cap');
  } else {
    await ctx.scene.enter('createorder_desiredtoken');
  }
});

createOrderUnitOfTimeScene.action('createorder_hourly', async (ctx) => {
  ctx.session.orderToCreate.unitOfTime = 'HOURS';

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_frequency');
});

createOrderUnitOfTimeScene.action('createorder_daily', async (ctx) => {
  ctx.session.orderToCreate.unitOfTime = 'DAYS';

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_frequency');
});

createOrderUnitOfTimeScene.action('createorder_weekly', async (ctx) => {
  ctx.session.orderToCreate.unitOfTime = 'WEEKS';

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_frequency');
});

createOrderUnitOfTimeScene.action('createorder_monthly', async (ctx) => {
  ctx.session.orderToCreate.unitOfTime = 'MONTHS';

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_frequency');
});
