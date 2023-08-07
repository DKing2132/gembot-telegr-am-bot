import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';
import { singleOrder } from '../../routes';
import { OrderResponse } from '../../types/responses/OrderResponse';

export const updateOrderSelectFieldScene = new Scenes.BaseScene<DCAContext>(
  'updateorder_selectfield'
);

updateOrderSelectFieldScene.enter(async (ctx) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}${singleOrder}?orderId=${ctx.session.orderToUpdate.orderID}`,
      {
        method: 'GET',
        headers: {
          'genesis-bot-user-id': ctx.from!.id.toString(),
        },
      }
    );

    if (response.ok) {
      const order: OrderResponse = await response.json();
      ctx.session.orderToUpdate.order = order;
      ctx.session.orderToUpdate.isLimitOrder = order.isLimitOrder;
    } else {
      console.log('error fetching order when updating');
    }
  } catch (error) {
    console.log(error);
  }

  const lastBtnRow = [backButton('updateorder_selectfield_back')];

  if (ctx.session.orderToUpdate.isLimitOrder) {
    lastBtnRow.unshift(
      Markup.button.callback('Target Market Cap', 'target_market_cap')
    );
  }

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
      lastBtnRow,
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

updateOrderSelectFieldScene.action('target_market_cap', async (ctx) => {
  ctx.session.orderToUpdate.field = 'marketCapTarget';

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_value');
});
