import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { tokenAPIRoute } from '../../routes';
import { temporaryHTMLReply, temporaryReply } from '../../replies';
import {
  generateTokenMarketCapFailedHTML,
  generateTokenMarketCapHTML,
} from '../../html';
import { backButton } from '../../keyboard/backButton';
import { TokenResponse } from '../../types/responses/TokenResponse';

export const createOrderMarketCapScene = new Scenes.BaseScene<DCAContext>(
  'createorder_market_cap'
);

createOrderMarketCapScene.enter(async (ctx) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}${tokenAPIRoute}?address=${ctx.session.orderToCreate.desiredTokenAddress}&onlyMarketCap=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const tokenResponse: TokenResponse = await response.json();

      await temporaryHTMLReply(
        ctx,
        await generateTokenMarketCapHTML(
          ctx.session.orderToCreate.desiredTokenAddress!,
          ctx.session.orderToCreate.isNativeETH!,
          tokenResponse.marketCap!
        ),
        Markup.inlineKeyboard([
          [
            Markup.button.callback('Billions', 'billions'),
            Markup.button.callback('Millions', 'millions'),
            Markup.button.callback('Thousands', 'thousands'),
          ],
          [backButton('createorder_market_cap_back')],
        ])
      );
    } else {
      const errorResponse: TokenResponse = await response.json();
      await temporaryHTMLReply(
        ctx,
        generateTokenMarketCapFailedHTML(errorResponse.message),
        Markup.inlineKeyboard([backButton('createorder_market_cap_back')])
      );
    }
  } catch (error) {
    console.log(error);
    await temporaryHTMLReply(
      ctx,
      generateTokenMarketCapFailedHTML('Unknown error.'),
      Markup.inlineKeyboard([backButton('createorder_market_cap_back')])
    );
  }
});

createOrderMarketCapScene.action('createorder_market_cap_back', async (ctx) => {
  ctx.session.orderToCreate.marketCapTarget = undefined;
  ctx.session.orderToCreate.desiredTokenAddress = undefined;
  ctx.session.amountUnit = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_desiredtoken');
});

createOrderMarketCapScene.action('billions', async (ctx) => {
  ctx.session.amountUnit = 'billions';

  await temporaryReply(
    ctx,
    'Please enter your target market cap (up to 2 decimals):',
    Markup.inlineKeyboard([backButton('createorder_market_cap_re_enter')])
  );
});

createOrderMarketCapScene.action('millions', async (ctx) => {
  ctx.session.amountUnit = 'millions';

  await temporaryReply(
    ctx,
    'Please enter your target market cap (up to 2 decimals): ',
    Markup.inlineKeyboard([backButton('createorder_market_cap_re_enter')])
  );
});

createOrderMarketCapScene.action('thousands', async (ctx) => {
  ctx.session.amountUnit = 'thousands';

  await temporaryReply(
    ctx,
    'Please enter your target market cap (up to 2 decimals): ',
    Markup.inlineKeyboard([backButton('createorder_market_cap_re_enter')])
  );
});

createOrderMarketCapScene.action(
  'createorder_market_cap_re_enter',
  async (ctx) => {
    ctx.session.amountUnit = undefined;

    await ctx.scene.reenter();
  }
);

// hears any number with up to 6 decimals
createOrderMarketCapScene.hears(/^\d+(\.\d{1,6})?$/, async (ctx) => {
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

  ctx.session.orderToCreate.marketCapTarget =
    Number(ctx.message.text) * multiplier;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_unit_of_time');
});
