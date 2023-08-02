import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { backButton } from '../../keyboard/backButton';
import { temporaryReply } from '../../replies';
import { UnitOfTime } from '../../types/UnitOfTime';

export const createOrderFrequencyScene = new Scenes.BaseScene<DCAContext>(
  'createorder_frequency'
);

createOrderFrequencyScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    `Please enter in how many ${generateFrequencyTypeString(
      ctx.session.orderToCreate.unitOfTime!
    )} you would like your full order to be completed by?`,
    Markup.inlineKeyboard([backButton('createorder_back')])
  );
});

createOrderFrequencyScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate.frequency = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_unit_of_time');
});

// hear any string containing only numbers
createOrderFrequencyScene.hears(/^\d+$/, async (ctx) => {
  ctx.session.orderToCreate.frequency = Number(ctx.message.text);

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_wallet');
});

const generateFrequencyTypeString = (unitOfTime: UnitOfTime) => {
  if (unitOfTime === 'HOURS') {
    return 'hours';
  } else if (unitOfTime === 'DAYS') {
    return 'days';
  } else if (unitOfTime === 'WEEKS') {
    return 'weeks';
  } else if (unitOfTime === 'MONTHS') {
    return 'months';
  } else {
    return 'transactions';
  }
};
