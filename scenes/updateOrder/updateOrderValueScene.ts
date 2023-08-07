import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply, temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';
import { UnitOfTime } from '../../types/UnitOfTime';
import {
  generateUpdateOrderInvalidValueTypeHTML,
  getMarketCapInText,
} from '../../html';

export const updateOrderValueScene = new Scenes.BaseScene<DCAContext>(
  'updateorder_value'
);

let isAddress = false;
let isAmount = false;
let isNumber = false;

updateOrderValueScene.enter(async (ctx) => {
  let refString = 'value';
  if (ctx.session.orderToUpdate.field === 'desiredToken') {
    isAddress = true;
    refString = 'address';
  } else if (ctx.session.orderToUpdate.field === 'depositedTokenAmount') {
    isAmount = true;
    refString = 'amount';
  } else if (ctx.session.orderToUpdate.field === 'frequency') {
    isNumber = true;
    refString = 'frequency';
  } else if (ctx.session.orderToUpdate.field === 'marketCapTarget') {
    isAmount = true;
    refString = 'value';
  }

  if (
    ctx.session.orderToUpdate.field === 'desiredToken' ||
    ctx.session.orderToUpdate.field === 'depositedTokenAmount' ||
    ctx.session.orderToUpdate.field === 'frequency'
  ) {
    await temporaryReply(
      ctx,
      `Please enter a new ${refString}:`,
      Markup.inlineKeyboard([backButton('updateorder_value_back')])
    );
  } else if (ctx.session.orderToUpdate.field === 'unitOfTime') {
    await temporaryReply(
      ctx,
      'Please select one of the following values:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Hourly', 'updateorder_value_hourly'),
          Markup.button.callback('Daily', 'updateorder_value_daily'),
        ],
        [
          Markup.button.callback('Weekly', 'updateorder_value_weekly'),
          Markup.button.callback('Monthly', 'updateorder_value_monthly'),
        ],
        [backButton('updateorder_value_back')],
      ])
    );
  } else if (ctx.session.orderToUpdate.field === 'marketCapTarget') {
    await temporaryReply(
      ctx,
      `This order's current target market cap is ${getMarketCapInText(
        ctx.session.orderToUpdate.order?.marketCapTarget?.toString() ?? ''
      )}. Please select the unit of your new target market cap:`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('Billions', 'billions'),
          Markup.button.callback('Millions', 'millions'),
          Markup.button.callback('Thousands', 'thousands'),
        ],
        [backButton('updateorder_value_back')],
      ])
    );
  }
});

updateOrderValueScene.action('billions', async (ctx) => {
  ctx.session.amountUnit = 'billions';

  await temporaryReply(
    ctx,
    'Please enter your new target market cap:',
    Markup.inlineKeyboard([backButton('updateorder_value_re_enter')])
  );
});

updateOrderValueScene.action('millions', async (ctx) => {
  ctx.session.amountUnit = 'millions';

  await temporaryReply(
    ctx,
    'Please enter your new target market cap:',
    Markup.inlineKeyboard([backButton('updateorder_value_re_enter')])
  );
});

updateOrderValueScene.action('thousands', async (ctx) => {
  ctx.session.amountUnit = 'thousands';

  await temporaryReply(
    ctx,
    'Please enter your new target market cap:',
    Markup.inlineKeyboard([backButton('updateorder_value_re_enter')])
  );
});

updateOrderValueScene.action('updateorder_value_re_enter', async (ctx) => {
  ctx.session.orderToUpdate.field = undefined;
  ctx.session.orderToUpdate.value = undefined;
  ctx.session.amountUnit = undefined;

  await ctx.scene.reenter();
});

updateOrderValueScene.action('updateorder_value_back', async (ctx) => {
  ctx.session.orderToUpdate.field = undefined;
  ctx.session.orderToUpdate.value = undefined;
  ctx.session.amountUnit = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_selectfield');
});

updateOrderValueScene.action('updateorder_value_hourly', async (ctx) => {
  ctx.session.orderToUpdate.value = 'HOURS' as UnitOfTime;

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_confirm');
});

updateOrderValueScene.action('updateorder_value_daily', async (ctx) => {
  ctx.session.orderToUpdate.value = 'DAYS' as UnitOfTime;

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_confirm');
});

updateOrderValueScene.action('updateorder_value_weekly', async (ctx) => {
  ctx.session.orderToUpdate.value = 'WEEKS' as UnitOfTime;

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_confirm');
});

updateOrderValueScene.action('updateorder_value_monthly', async (ctx) => {
  ctx.session.orderToUpdate.value = 'MONTHS' as UnitOfTime;

  await ctx.scene.leave();
  await ctx.scene.enter('updateorder_confirm');
});

// hears any string starting with 0x up to 75 chars long
updateOrderValueScene.hears(/^0x[0-9a-fA-F]{40}$/, async (ctx) => {
  if (isAddress) {
    ctx.session.orderToUpdate.value = ctx.message.text;

    await ctx.scene.leave();
    await ctx.scene.enter('updateorder_confirm');
  } else {
    await temporaryHTMLReply(
      ctx,
      generateUpdateOrderInvalidValueTypeHTML(isAmount ? 'Amount' : 'Frequency')
    );
  }
});

// hears any number with up to 6 decimals
updateOrderValueScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
  if (isAmount || isNumber) {
    ctx.session.orderToUpdate.value = Number(ctx.message.text);

    if (ctx.session.orderToUpdate.field === 'marketCapTarget') {
      let multiplier: number;
      if (ctx.session.amountUnit === 'billions') {
        multiplier = 10 ** 9;
      } else if (ctx.session.amountUnit === 'millions') {
        multiplier = 10 ** 6;
      } else if (ctx.session.amountUnit === 'thousands') {
        multiplier = 10 ** 3;
      } else {
        multiplier = 1;
      }

      ctx.session.orderToUpdate.value *= multiplier;
    }

    await ctx.scene.leave();
    await ctx.scene.enter('updateorder_confirm');
  } else {
    await temporaryHTMLReply(
      ctx,
      generateUpdateOrderInvalidValueTypeHTML('Address')
    );
  }
});
